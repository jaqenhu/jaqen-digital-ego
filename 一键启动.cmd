@echo off
setlocal
cd /d "%~dp0"
if errorlevel 1 goto failed

where node.exe >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Install Node.js, then run this file again.
  goto failed
)
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm was not found. Reinstall Node.js, then try again.
  goto failed
)
where pm2.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] PM2 was not found. Run: npm install -g pm2
  goto failed
)

if not exist "node_modules\vite\bin\vite.js" (
  echo Installing project dependencies...
  call npm.cmd ci
  if errorlevel 1 goto failed
)

echo Building the latest website...
call npm.cmd run build
if errorlevel 1 goto failed

echo Starting the background service...
call pm2.cmd startOrRestart ecosystem.config.cjs --only jaqenhu-portfolio-local --update-env
if errorlevel 1 goto failed

echo Waiting for http://127.0.0.1:5173 ...
node.exe scripts\wait-for-local-site.cjs
if errorlevel 1 (
  echo [ERROR] The website did not start. Check whether port 5173 is in use.
  echo View service logs with: pm2 logs jaqenhu-portfolio-local --lines 30
  goto failed
)

echo.
echo Website ready: http://127.0.0.1:5173
echo You can close this window. PM2 will keep the website running.
if /i "%~1"=="--no-ui" exit /b 0
start "" "http://127.0.0.1:5173"
pause
exit /b 0

:failed
echo.
echo [ERROR] Startup failed. See the message above.
if /i not "%~1"=="--no-ui" pause
exit /b 1
