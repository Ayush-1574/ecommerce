# Quick Start Guide

Get your e-commerce server running in 5 minutes!

## ⚡ 5-Minute Setup

### Step 1: Ensure PostgreSQL is Running
```bash
# Windows
net start postgresql-x64-15

# macOS
brew services start postgresql

# Linux
sudo service postgresql start

# Test connection
psql -U postgres -c "SELECT 1;"
```

### Step 2: Create Database
```bash
psql -U postgres -c "CREATE DATABASE ecommerce_db;"
```

### Step 3: Install & Initialize (Choose One)

**Option A: Automated (Recommended)**
```bash
cd server
setup.bat          # Windows
chmod +x setup.sh && ./setup.sh  # macOS/Linux
```

**Option B: Manual**
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### Step 4: Start Server
```bash
npm run dev
```

✅ Server running at `http://localhost:5000`

---

## 🧪 Test It's Working

```bash
# In another terminal
curl http://localhost:5000/api/auth

# Or use Postman/Thunder Client
# POST to http://localhost:5000/api/auth/register
# Body: {"userName":"test","email":"test@test.com","password":"password"}
```

---

## 📚 Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start with auto-reload |
| `npm start` | Start production mode |
| `npx prisma studio` | Open database UI |
| `npx prisma migrate dev` | Create migration |
| `npx prisma migrate reset` | Reset database ⚠️ |
| `npx prisma generate` | Regenerate client |

---

## 🔍 Environment Setup

Check your `.env` file has:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce_db"
PORT=5000
NODE_ENV=development
CLIENT_SECRET_KEY=your_secret_key_here
```

**Note**: Update `password` if your PostgreSQL password is different

---

## ❌ Common Issues

### "Cannot connect to PostgreSQL"
```bash
# Make sure it's running
psql -U postgres -c "SELECT 1;"
```

### "Database does not exist"
```bash
# Create it
psql -U postgres -c "CREATE DATABASE ecommerce_db;"
```

### "Port 5000 already in use"
```bash
# Change PORT in .env to 5001 or kill process
netstat -ano | findstr :5000  # Windows
lsof -i :5000                # macOS/Linux
```

### "Prisma Client not found"
```bash
npx prisma generate
```

---

## 📖 Full Documentation

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup guide
- [README_PRISMA.md](README_PRISMA.md) - Project overview
- [INTEGRATION_CHECKLIST.md](INTEGRATION_CHECKLIST.md) - Verification checklist
- [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) - What was changed

---

## 🎯 API Quick Reference

```bash
# Register
POST /api/auth/register
{ "userName": "user1", "email": "user@test.com", "password": "pass123" }

# Login  
POST /api/auth/login
{ "email": "user@test.com", "password": "pass123" }

# Get Products
GET /api/shop/products

# Add to Cart
POST /api/shop/cart/add
{ "userId": "123", "productId": "456", "quantity": 1 }

# Get User Cart
GET /api/shop/cart/get/userId

# Create Order
POST /api/shop/order/create
{ "userId": "123", "cartItems": [...], "addressInfo": {...}, "totalAmount": 100 }
```

---

## 🚀 Ready to Go!

You're all set. Start the server with `npm run dev` and begin developing!

For detailed information, see [README_PRISMA.md](README_PRISMA.md)

**Happy coding! 🎉**
