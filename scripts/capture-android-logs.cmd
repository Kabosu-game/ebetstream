@echo off
cd /d "%~dp0.."
REM Passer le package si besoin: capture-android-logs.cmd "com.votre.package"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0capture-android-logs.ps1" %*
pause
