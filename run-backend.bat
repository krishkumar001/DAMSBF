@echo off
echo Starting DAMS Backend Server...
echo.
cd backend
echo Current directory: %CD%
echo.
echo Running server...
node server.js
pause 