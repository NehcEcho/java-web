@echo off
echo ========================================
echo   Hotel Room Management System - Start
echo ========================================

echo.
echo [1/4] Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo [2/4] Installing backend dependencies...
cd backend
mvn install -DskipTests
cd ..

echo.
echo [3/4] Starting backend server...
start "Backend Server" cmd /k "cd backend && mvn spring-boot:run"

echo.
echo [4/4] Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:5173
echo ========================================
echo.
pause
