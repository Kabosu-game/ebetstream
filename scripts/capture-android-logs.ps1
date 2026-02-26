# Capture automatique des logs Android : demarrage de l'app jusqu'a sa fermeture (crash ou arret)
# Usage:
#   .\capture-android-logs.ps1
#   .\capture-android-logs.ps1 -Package "com.getcapacitor.myapp"
# Le package est l'applicationId de votre app (android/app/build.gradle).

param(
    [string]$Package = "com.getcapacitor.myapp"
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outDir = Join-Path (Join-Path $PSScriptRoot "..") "android-logs"
$fullLog = Join-Path $outDir "logcat_$timestamp.txt"
$errorsLog = Join-Path $outDir "logcat_errors_$timestamp.txt"

# Trouver adb : PATH ou SDK Android (emplacements courants sous Windows)
$adb = $null
if (Get-Command adb -ErrorAction SilentlyContinue) {
    $adb = "adb"
} else {
    $sdkRoots = @(
        $env:LOCALAPPDATA + "\Android\Sdk",
        $env:USERPROFILE + "\AppData\Local\Android\Sdk",
        "C:\Android\Sdk"
    )
    foreach ($root in $sdkRoots) {
        $exe = Join-Path $root "platform-tools\adb.exe"
        if (Test-Path $exe) {
            $adb = $exe
            break
        }
    }
}
if (-not $adb) {
    Write-Host "Erreur: 'adb' introuvable." -ForegroundColor Red
    Write-Host "Installez Android Studio ou ajoutez le SDK (platform-tools) au PATH." -ForegroundColor Yellow
    Write-Host "Ex: setx PATH \"%PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools\"" -ForegroundColor Gray
    exit 1
}

$devices = & $adb devices 2>&1 | Out-String
if ($devices -notmatch "device\s*$") {
    Write-Host "Aucun appareil connecte. Branchez le telephone (USB debug active)." -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

Write-Host "Package cible: $Package" -ForegroundColor Cyan
Write-Host "Vidage du logcat..." -ForegroundColor Yellow
& $adb logcat -c
Start-Sleep -Seconds 1

# Demarrer logcat en arriere-plan (ecriture dans le fichier)
$stderrLog = Join-Path $outDir "logcat_stderr.txt"
$logcatProc = Start-Process -FilePath $adb -ArgumentList "logcat", "-v", "threadtime", "*:V" -RedirectStandardOutput $fullLog -RedirectStandardError $stderrLog -NoNewWindow -PassThru
Start-Sleep -Seconds 1

if ($logcatProc.HasExited) {
    Write-Host "Erreur: logcat n'a pas pu demarrer." -ForegroundColor Red
    exit 1
}

Write-Host "Capture demarree. Lancement de l'app..." -ForegroundColor Green
# Lancer l'app (activite principale Capacitor)
& $adb shell am start -n "${Package}/.MainActivity" -a android.intent.action.MAIN -c android.intent.category.LAUNCHER 2>&1 | Out-Null
Start-Sleep -Seconds 2

# Attendre que l'app se ferme (crash ou utilisateur quitte), ou timeout 3 min
Write-Host "Surveillance du processus. Fermez l'app (ou attendez le crash) pour arreter la capture." -ForegroundColor Green
$wasRunning = $false
$startTime = Get-Date
$timeoutSec = 180
while ($true) {
    $elapsed = ((Get-Date) - $startTime).TotalSeconds
    if ($elapsed -ge $timeoutSec) {
        Write-Host "Timeout ($timeoutSec s). Arret de la capture." -ForegroundColor Yellow
        break
    }
    $pidLine = & $adb shell pidof $Package 2>&1
    $pid = ($pidLine -replace "`r`n", "").Trim()
    if ($pid -match "^\d+") {
        $wasRunning = $true
    } else {
        if ($wasRunning) {
            Write-Host "App fermee. Arret de la capture..." -ForegroundColor Yellow
            break
        }
        # App pas demarree ou crash immediate : apres 10 s on arrete quand meme
        if ($elapsed -ge 10) {
            Write-Host "App non demarree ou crash au lancement. Arret de la capture." -ForegroundColor Yellow
            break
        }
        Start-Sleep -Milliseconds 500
        continue
    }
    Start-Sleep -Seconds 1
}

# Arreter logcat
Stop-Process -Id $logcatProc.Id -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

# Extraire les lignes d'erreur dans un fichier separe
if (Test-Path $fullLog) {
    Get-Content $fullLog -Encoding utf8 -ErrorAction SilentlyContinue | Where-Object {
        $_ -match "FATAL|AndroidRuntime|Exception|Error|crash|died"
    } | Set-Content $errorsLog -Encoding utf8
    Write-Host ""
    Write-Host "Logs complets : $fullLog" -ForegroundColor Green
    Write-Host "Resume erreurs : $errorsLog" -ForegroundColor Green
    Write-Host "Recherchez 'FATAL' ou 'AndroidRuntime' pour la cause du crash." -ForegroundColor Yellow
} else {
    Write-Host "Aucun log enregistre." -ForegroundColor Red
}
