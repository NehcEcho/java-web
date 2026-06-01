@echo off
setlocal
set "ROOT=%~dp0"
echo ========================================
echo   Hotel Room Management System - Start
echo ========================================

echo.
echo [1/4] Installing frontend dependencies...
cd /d "%ROOT%frontend"
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause & exit /b 1
)

echo.
echo [2/4] Building backend...
cd /d "%ROOT%backend"
call mvn compile -q
if %errorlevel% neq 0 (
    echo ERROR: mvn compile failed
    pause & exit /b 1
)

echo.
echo [3/4] Starting backend server on port 1301...
cd /d "%ROOT%backend"
start "Backend" cmd /c "cd /d "%ROOT%backend" && mvn spring-boot:run"

echo.
echo [4/4] Starting frontend server on port 1300...
cd /d "%ROOT%frontend"
start "Frontend" cmd /c "cd /d "%ROOT%frontend" && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo   Backend:  http://localhost:1301
echo   Frontend: http://localhost:1300
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
