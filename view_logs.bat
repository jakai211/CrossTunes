@echo off
REM CrossTunes Log Viewer for Windows
REM Usage: view_logs.bat [backend|website|all] [lines]

if "%1"=="" (
    set LOG_TYPE=all
) else (
    set LOG_TYPE=%1
)

if "%2"=="" (
    set LINES=20
) else (
    set LINES=%2
)

echo === CrossTunes Login Logs ===
echo Showing last %LINES% entries
echo.

if "%LOG_TYPE%"=="backend" (
    goto :backend_only
)
if "%LOG_TYPE%"=="website" (
    goto :website_only
)

:backend_only
echo 📊 BACKEND LOGINS:
if exist "logs\backend\login.log" (
    powershell -Command "Get-Content logs\backend\login.log -Tail %LINES% | ForEach-Object { try { $obj = ConvertFrom-Json $_; Write-Host \"$($obj.timestamp) - $($obj.email) ($($obj.name)) - Success: $($obj.success)\" } catch { Write-Host $_ } }"
) else (
    echo No backend login logs found
)
echo.
if "%LOG_TYPE%"=="backend" goto :errors

:website_only
echo 🌐 WEBSITE LOGINS:
if exist "logs\website\login.log" (
    powershell -Command "Get-Content logs\website\login.log -Tail %LINES% | ForEach-Object { try { $obj = ConvertFrom-Json $_; Write-Host \"$($obj.timestamp) - $($obj.email) ($($obj.name)) - Success: $($obj.success)\" } catch { Write-Host $_ } }"
) else (
    echo No website login logs found
)
echo.
if "%LOG_TYPE%"=="website" goto :errors

:errors
echo === Recent Errors ===
if exist "logs\backend\error.log" (
    echo Backend errors:
    powershell -Command "Get-Content logs\backend\error.log -Tail 5 | ForEach-Object { try { $obj = ConvertFrom-Json $_; Write-Host \"$($obj.timestamp) - $($obj.message)\" } catch { Write-Host $_ } }"
)

if exist "logs\website\error.log" (
    echo Website errors:
    powershell -Command "Get-Content logs\website\error.log -Tail 5 | ForEach-Object { try { $obj = ConvertFrom-Json $_; Write-Host \"$($obj.timestamp) - $($obj.message)\" } catch { Write-Host $_ } }"
)

echo.
pause