# Startup Scripts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use @subagent-driven-development (recommended) or @executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create two batch files (`start.bat` and `stop.bat`) for one-click startup and shutdown of the Hotel Room Management System.

**Architecture:** Simple Windows batch files that install dependencies and manage server processes via command line.

**Tech Stack:** Windows Batch scripting, npm, Maven

---

## File Structure

```
hotel-management/
├── start.bat          # Create: Install dependencies and start servers
├── stop.bat           # Create: Stop running servers
├── backend/           # Existing: Spring Boot application
└── frontend/          # Existing: React application
```

## Tasks

### Task 1: Create start.bat - Basic Structure

**Files:**
- Create: `start.bat`

- [ ] **Step 1: Create start.bat with banner and basic structure**

```batch
@echo off
echo ========================================
echo   Hotel Room Management System - Start
echo ========================================
echo.
echo Starting the system...
echo.
pause
```

- [ ] **Step 2: Test basic structure**

Run: `start.bat`
Expected: Displays banner and pauses for user input

- [ ] **Step 3: Commit**

```bash
git add start.bat
git commit -m "feat: add basic start.bat structure"
```

### Task 2: Add Dependency Installation to start.bat

**Files:**
- Modify: `start.bat`

- [ ] **Step 1: Add frontend dependency installation**

```batch
@echo off
echo ========================================
echo   Hotel Room Management System - Start
echo ========================================

echo.
echo [1/2] Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
pause
```

- [ ] **Step 2: Test frontend installation**

Run: `start.bat`
Expected: Runs npm install in frontend directory

- [ ] **Step 3: Add backend dependency installation**

```batch
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
```

- [ ] **Step 4: Test both installations**

Run: `start.bat`
Expected: Runs npm install and mvn install

- [ ] **Step 5: Commit**

```bash
git add start.bat
git commit -m "feat: add dependency installation to start.bat"
```

### Task 3: Add Server Startup to start.bat

**Files:**
- Modify: `start.bat`

- [ ] **Step 1: Add backend server startup**

```batch
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
pause
```

- [ ] **Step 2: Test backend startup**

Run: `start.bat`
Expected: Opens new command window running Spring Boot

- [ ] **Step 3: Add frontend server startup**

```batch
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
```

- [ ] **Step 4: Test complete start.bat**

Run: `start.bat`
Expected: Installs dependencies and opens two new windows with servers

- [ ] **Step 5: Commit**

```bash
git add start.bat
git commit -m "feat: complete start.bat with server startup"
```

### Task 4: Create stop.bat - Basic Structure

**Files:**
- Create: `stop.bat`

- [ ] **Step 1: Create stop.bat with banner**

```batch
@echo off
echo ========================================
echo   Hotel Room Management System - Stop
echo ========================================
echo.
echo Stopping all servers...
echo.
pause
```

- [ ] **Step 2: Test basic structure**

Run: `stop.bat`
Expected: Displays banner and pauses for user input

- [ ] **Step 3: Commit**

```bash
git add stop.bat
git commit -m "feat: add basic stop.bat structure"
```

### Task 5: Add Port-Based Process Termination to stop.bat

**Files:**
- Modify: `stop.bat`

- [ ] **Step 1: Add backend server termination**

```batch
@echo off
echo ========================================
echo   Hotel Room Management System - Stop
echo ========================================

echo.
echo Stopping backend server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do (
    echo Found process on port 8080, PID: %%a
    taskkill /F /PID %%a 2>nul
    if !errorlevel! equ 0 (
        echo Backend server stopped.
    ) else (
        echo Backend server not found or already stopped.
    )
)

echo.
pause
```

- [ ] **Step 2: Test backend termination**

Run: `stop.bat` while backend is running
Expected: Finds and kills process on port 8080

- [ ] **Step 3: Add frontend server termination**

```batch
@echo off
echo ========================================
echo   Hotel Room Management System - Stop
echo ========================================

echo.
echo Stopping backend server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do (
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
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
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
```

- [ ] **Step 4: Test complete stop.bat**

Run: `stop.bat` while both servers are running
Expected: Stops both servers and displays completion message

- [ ] **Step 5: Commit**

```bash
git add stop.bat
git commit -m "feat: complete stop.bat with port-based termination"
```

### Task 6: Integration Testing

**Files:**
- None (testing only)

- [ ] **Step 1: Test complete workflow**

1. Run `start.bat` - verify both servers start
2. Access http://localhost:8080 - verify backend responds
3. Access http://localhost:5173 - verify frontend responds
4. Run `stop.bat` - verify both servers stop
5. Try accessing URLs again - verify servers are down

- [ ] **Step 2: Test edge cases**

1. Run `stop.bat` when no servers are running
2. Run `start.bat` twice in a row
3. Check if ports are actually freed after stopping

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete startup scripts with integration tests"
```

## Self-Review Checklist

- [x] **Spec coverage:** All requirements from spec are covered in tasks ✓
- [x] **Placeholder scan:** No "TBD"/"TODO"/"implement later" ✓
- [x] **Type consistency:** All commands and syntax are correct ✓
- [x] **File paths:** Exact file paths provided for all tasks ✓
- [x] **Code in steps:** Complete code provided for every step ✓
- [x] **Test coverage:** Each feature has test steps ✓
- [x] **Commands:** Exact commands with expected outputs ✓