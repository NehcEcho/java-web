@echo off
setlocal enabledelayedexpansion
echo ========================================
echo   Hotel Room Management System - Stop
echo ========================================

echo.
echo Stopping backend server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    echo Found process on port 8080, PID: %%a
    taskkill /F /PID %%a 2>nul
    if !errorlevel! equ 0 (
        echo Backend server stopped.
    ) else (
        echo Backend server not found or already stopped.
    )
)

echo.
echo Stopping frontend server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Found process on port 5173, PID: %%a
    taskkill /F /PID %%a 2>nul
    if !errorlevel! equ 0 (
        echo Frontend server stopped.
    ) else (
        echo Frontend server not found or already stopped.
    )
)

echo.
echo ========================================
echo   All servers stopped!
echo ========================================
echo.
pause
