@echo off
setlocal
cd /d "%~dp0"
if errorlevel 1 goto failed

where pm2.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] PM2 was not found.
  goto failed
)

call pm2.cmd stop jaqenhu-portfolio-local
if errorlevel 1 goto failed
echo Website stopped.
if /i not "%~1"=="--no-ui" pause
exit /b 0

:failed
echo [ERROR] Could not stop the website. See the message above.
if /i not "%~1"=="--no-ui" pause
exit /b 1
