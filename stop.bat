@echo off
echo ========================================
echo   Hotel Room Management System - Stop
echo ========================================

echo.
echo Stopping servers by port...

set "found=0"

rem Stop port 8080 (backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080" ^| findstr "LISTENING" 2^>nul') do (
    echo Found backend on port 8080, PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if not errorlevel 1 (
        echo Backend server stopped.
        set "found=1"
    )
)

rem Stop port 5173 (frontend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING" 2^>nul') do (
    echo Found frontend on port 5173, PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if not errorlevel 1 (
        echo Frontend server stopped.
        set "found=1"
    )
)

if "%found%"=="0" (
    echo No running servers found on ports 8080 or 5173.
)

echo.
echo ========================================
echo   Done!
echo ========================================
echo.
pause
