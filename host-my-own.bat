@echo off
title RythuRoute Self-Hosted Server
echo ====================================================
echo   Starting RythuRoute on your Windows PC (Self-Hosted)
echo ====================================================
echo.

cd /d "%~dp0"

echo [1/2] Building latest frontend bundle...
call npm run build

echo.
echo [2/2] Launching RythuRoute server on http://localhost:5000...
echo.
echo Your local database (database.sqlite) and photos (/uploads) 
echo are 100%% safe on your hard drive and will NEVER be deleted!
echo.
node backend/src/server.js
pause
