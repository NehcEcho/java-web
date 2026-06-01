@echo off
echo ========================================
echo   Hotel Room Management System - Stop
echo ========================================

echo.
echo Stopping servers by port...

set "found=0"

rem Stop port 1301 (backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":1301" ^| findstr "LISTENING" 2^>nul') do (
    echo Found backend on port 1301, PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if not errorlevel 1 (
        echo Backend server stopped.
        set "found=1"
    )
)

rem Stop port 1300 (frontend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":1300" ^| findstr "LISTENING" 2^>nul') do (
    echo Found frontend on port 1300, PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if not errorlevel 1 (
        echo Frontend server stopped.
        set "found=1"
    )
)

if "%found%"=="0" (
    echo No running servers found on ports 1300 or 1301.
)

echo.
echo ========================================
echo   Done!
echo ========================================
echo.
pause
