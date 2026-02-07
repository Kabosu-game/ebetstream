# PowerShell script to replace API URLs
# Usage: .\scripts\replace-api-urls.ps1

$files = Get-ChildItem -Path "src" -Include *.vue,*.ts,*.js -Recurse | Where-Object { 
    $_.FullName -notmatch "node_modules" -and 
    $_.FullName -notmatch "config\\api\.ts" -and 
    $_.FullName -notmatch "utils\\axios\.ts" 
}

$updated = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Replace axios imports
    if ($content -match "import\s+axios\s+from" -and $content -notmatch "apiClient") {
        $content = $content -replace "import\s+axios\s+from\s+['`"]axios['`"];?", "import apiClient from `"@/utils/axios`";"
    }
    
    # Replace API URLs
    $content = $content -replace "http://127\.0\.0\.1:8000/api/([^`"'`s`]+)", '/$1'
    
    # Replace axios calls
    $content = $content -replace "\baxios\.(get|post|put|delete|patch)\(", "apiClient.`$1("
    
    # Remove Authorization headers (apiClient adds them automatically)
    $content = $content -replace ",\s*\{\s*headers:\s*\{\s*Authorization:\s*`Bearer\s+\$`{token`}`\s*\}\s*\}", ""
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "✓ $($file.FullName)"
        $updated++
    }
}

Write-Host "`n✓ Updated $updated files."



