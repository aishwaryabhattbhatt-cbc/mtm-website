@echo off
REM Hero 9 WebGL Noise Distortion Effect - Quick Start Script (Windows)

color 0A
title Hero 9 - WebGL Noise Distortion Effect

echo.
echo ========================================
echo    Hero 9 - WebGL Noise Distortion Effect
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js is not installed.
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i

echo [OK] Node.js version: %NODE_VERSION%
echo [OK] npm version: %NPM_VERSION%
echo.

REM Navigate to project directory
cd /d "%~dp0hero9-noise-warp"
echo [INFO] Working directory: %cd%
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    echo        (This may take a minute...)
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully
) else (
    echo [OK] Dependencies already installed
)

echo.
echo [INFO] Starting development server...
echo.
echo    ^> Development server will open at: http://localhost:5174/
echo    ^> Press Ctrl+C to stop the server
echo.
echo [INFO] What to do next:
echo    1. The browser will auto-open when ready
echo    2. Use GUI panel (top-right) to adjust effects
echo    3. Click '📁 Load Image' or drag images to load them
echo    4. Adjust sliders to see real-time distortion updates
echo.

REM Start development server
call npm run dev
pause
