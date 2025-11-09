@echo off
REM Development startup script for Windows
REM Usage: Just double-click this file or run: dev.bat

title SyncGaming Development Server
cls

echo.
echo =========================================
echo   SyncGaming - Development Environment
echo =========================================
echo.
echo Starting backend and frontend servers...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo =========================================
echo.

REM Start backend in background
start "SyncGaming Backend" cmd /k "cd backend && node server.js"

REM Wait 2 seconds then start frontend
timeout /t 2 /nobreak

REM Start frontend
start "SyncGaming Frontend" cmd /k "npm start"

REM Show instructions
echo.
echo =========================================
echo   Servers Starting...
echo =========================================
echo.
echo Two new windows should open:
echo   1. Backend Server (http://localhost:5000)
echo   2. Frontend Server (http://localhost:3000)
echo.
echo Frontend will open automatically.
echo Backend logs will show in its window.
echo.
echo Press Ctrl+C in either window to stop.
echo Close all windows to shut down completely.
echo.
echo =========================================
echo.

timeout /t 5
