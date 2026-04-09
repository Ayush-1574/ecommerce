#!/bin/bash

# E-Commerce Server Quick Setup Script
# This script automates the Prisma and PostgreSQL setup for Unix-like systems

echo ""
echo "========================================"
echo "E-Commerce Server Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js is installed"
echo ""

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
if command -v psql &> /dev/null; then
    if psql -h localhost -U postgres -c "SELECT version();" &> /dev/null; then
        echo "✓ PostgreSQL is accessible"
    else
        echo "WARNING: Cannot connect to PostgreSQL"
        echo "Please ensure PostgreSQL is running on localhost:5432"
        echo ""
    fi
else
    echo "WARNING: psql not found. Please ensure PostgreSQL is installed."
fi
echo ""

# Install npm dependencies
echo "Installing npm dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install npm dependencies"
    exit 1
fi
echo "✓ Dependencies installed"
echo ""

# Create database if it doesn't exist
echo "Creating database..."
psql -h localhost -U postgres -c "CREATE DATABASE ecommerce_db;" 2>/dev/null
echo "✓ Database created (or already exists)"
echo ""

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to generate Prisma Client"
    exit 1
fi
echo "✓ Prisma Client generated"
echo ""

# Run migrations
echo "Running database migrations..."
npx prisma migrate dev --name init
if [ $? -ne 0 ]; then
    echo "WARNING: Migration may have failed. Check the output above."
fi
echo "✓ Migrations applied"
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Update .env with your actual credentials if needed"
echo "2. Run the server with: npm run dev"
echo "3. Open http://localhost:5000 in your browser"
echo ""
echo "For database management, run:"
echo "  npx prisma studio"
echo ""
