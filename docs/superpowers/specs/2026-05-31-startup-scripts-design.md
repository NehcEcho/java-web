# Startup Scripts Design

## Overview

One-click startup scripts for the Hotel Room Management System. Two batch files: `start.bat` to install dependencies and launch both backend and frontend servers, and `stop.bat` to terminate running servers.

## Requirements

- **Script type:** Windows batch files (.bat)
- **Startup:** Simultaneously start both Spring Boot backend and Vite frontend
- **Dependencies:** Install npm and Maven dependencies before starting
- **Termination:** Provide separate script to stop all servers
- **Dependency checking:** Not required (assume Java and Node.js are installed)

## Design

### start.bat

**Purpose:** Install dependencies and start both servers in parallel.

**Workflow:**
1. Display banner
2. Install frontend dependencies (`npm install` in `frontend/`)
3. Install backend dependencies (`mvn install -DskipTests` in `backend/`)
4. Start backend server in new window (`mvn spring-boot:run`)
5. Start frontend server in new window (`npm run dev`)
6. Display success message with URLs

**Implementation:**
- Use `start` command to launch servers in separate command windows
- Use `cmd /k` to keep windows open after server starts
- Display progress indicators and final status

### stop.bat

**Purpose:** Terminate all running servers by port.

**Workflow:**
1. Display banner
2. Find and kill process on port 8080 (backend)
3. Find and kill process on port 5173 (frontend)
4. Display completion message

**Implementation:**
- Use `netstat -aon | findstr :PORT` to find PIDs
- Use `taskkill /F /PID` to terminate processes
- Handle cases where servers are not running

## File Structure

```
hotel-management/
├── start.bat          # Start script
├── stop.bat           # Stop script
├── backend/
└── frontend/
```

## Usage

### Starting the system
```bash
# Double-click start.bat or run in command prompt
start.bat
```

### Stopping the system
```bash
# Double-click stop.bat or run in command prompt
stop.bat
```

## Technical Details

### Port Configuration
- **Backend:** 8080 (Spring Boot default)
- **Frontend:** 5173 (Vite default)

### Dependencies Installed
- **Frontend:** npm packages from `package.json`
- **Backend:** Maven dependencies from `pom.xml` (skipping tests for speed)

### Error Handling
- Scripts use `2>nul` to suppress error messages when processes are not found
- Scripts continue execution even if one server fails to stop

## Testing

1. Run `start.bat` - verify both servers start and are accessible
2. Run `stop.bat` - verify both servers are terminated
3. Test edge cases:
   - Running `stop.bat` when servers are not running
   - Running `start.bat` twice (should restart servers)
   - Checking if ports are actually freed after stopping

## Future Enhancements (Out of Scope)

- Status command to check if servers are running
- Log file output
- Configuration file for custom ports
- Linux/macOS shell scripts