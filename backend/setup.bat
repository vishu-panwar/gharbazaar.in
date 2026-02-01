@echo off
REM 🚀 Quick Setup Script for GharBazaar Socket.IO Backend (Windows)

echo ========================================
echo    GharBazaar Backend Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ✅ .env file created - Please configure it!
    echo.
    echo ⚠️  IMPORTANT: Edit .env and set:
    echo    - JWT_SECRET to a strong random string
    echo    - MONGODB_URI to your MongoDB connection
    echo.
) else (
    echo ✅ .env file already exists
)

echo.
echo ========================================
echo    Setup Complete! 🎉
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your configuration
echo 2. Start MongoDB: mongod
echo 3. Run: npm run dev
echo.
echo For help, see README.md
echo.
pause
