@echo off
echo Starting VST3 Interface Designer Progress Tracker...
echo Updates every 5 minutes. Press Ctrl+C to stop.
echo.

cd /d "%~dp0scripts"
node progress-updater.js

pause