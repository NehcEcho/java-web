@echo off
echo ========================================
echo   Hotel Room Management System - Start
echo ========================================

echo.
echo [1/3] Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo [2/3] Installing backend dependencies...
cd backend
mvn install -DskipTests
cd ..

echo.
pause
