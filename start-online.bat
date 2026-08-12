@echo off
title RythuRoute Self-Hosted Server + Cloudflare Public Tunnel
echo ================================================================
echo   RythuRoute 24/7 Self-Hosted Server with Cloudflare Tunnel
echo ================================================================
echo.
echo [1/3] Building latest frontend bundle and verifying database...
cd /d "%~dp0"
call npm run build

echo.
echo [2/3] Launching RythuRoute Server in background on port 5000...
start "RythuRoute Backend & Frontend Server" cmd /k "title RythuRoute Server && cd /d "%~dp0" && node backend/src/server.js"

echo.
echo [3/3] Starting Cloudflare Public Tunnel (Free HTTPS URL)...
echo ================================================================
echo ✅ Your database (database.sqlite) and images (/uploads) are 
echo    permanently saved on your hard drive and will NEVER be lost!
echo.
echo 🌐 Copy the HTTPS URL displayed below (e.g. https://...trycloudflare.com)
echo    and share it with anyone or open it on any mobile or desktop!
echo ================================================================
echo.
npx --yes cloudflared tunnel --url http://localhost:5000
pause
