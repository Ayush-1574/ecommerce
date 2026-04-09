@echo off
REM E-Commerce Server Quick Setup Script
REM This script automates the Prisma and PostgreSQL setup

echo.
echo ========================================
echo E-Commerce Server Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

REM Check if PostgreSQL is running
echo Checking PostgreSQL connection...
set PGPASSWORD=password
psql -h localhost -U postgres -c "SELECT version();" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Cannot connect to PostgreSQL
    echo Please ensure PostgreSQL is running on localhost:5432
    echo.
    pause
)
echo ✓ PostgreSQL is accessible
echo.

REM Install npm dependencies
echo Installing npm dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install npm dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

REM Create database if it doesn't exist
echo Creating database...
set PGPASSWORD=password
psql -h localhost -U postgres -c "CREATE DATABASE ecommerce_db;" 2>nul
echo ✓ Database created (or already exists)
echo.

REM Generate Prisma Client
echo Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma Client
    pause
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

REM Run migrations
echo Running database migrations...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo WARNING: Migration may have failed. Check the output above.
)
echo ✓ Migrations applied
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update .env with your actual credentials if needed
echo 2. Run the server with: npm run dev
echo 3. Open http://localhost:5000 in your browser
echo.
echo For database management, run:
echo   npx prisma studio
echo.
pause
