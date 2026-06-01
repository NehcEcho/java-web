@echo off
setlocal
set "ROOT=%~dp0"
echo ========================================
echo   Hotel Room Management System - Start
echo ========================================

echo.
echo [1/4] Installing frontend dependencies...
cd /d "%ROOT%frontend"
npm install

echo.
echo [2/4] Installing backend dependencies...
cd /d "%ROOT%backend"
mvn install -DskipTests

echo.
echo [3/4] Starting backend server...
start "Backend Server" cmd /k "cd /d "%ROOT%backend" && mvn spring-boot:run"

echo.
echo [4/4] Starting frontend server...
start "Frontend Server" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:5173
echo ========================================
echo.
pause
