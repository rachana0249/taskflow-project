@echo off
echo ============================================
echo   TaskFlow - Real-time Task Manager
echo   24BIT0441 Rachana P - BITE304L
echo ============================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is NOT installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo.
    echo [INFO] Installing dependencies... please wait...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed!
)

echo.
echo [INFO] Starting TaskFlow server...
echo [INFO] Once started, your browser will open: http://localhost:5000
echo [INFO] Press Ctrl+C to stop the server
echo.

:: Start server and open browser after 2 seconds
start /b cmd /c "timeout /t 2 >nul && start http://localhost:5000"
node backend/server.js

pause
