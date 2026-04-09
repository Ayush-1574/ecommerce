# E-Commerce Server

A full-featured Node.js Express server for an e-commerce application, built with **Prisma ORM**, **PostgreSQL**, and **PayPal integration**.

## 🚀 Features

- **User Authentication**: Register, login, and JWT-based authentication
- **Product Management**: CRUD operations for products (admin only)
- **Shopping Cart**: Add, update, and manage cart items
- **Orders**: Create orders and manage order lifecycle
- **PayPal Integration**: Secure payment processing with PayPal
- **Product Reviews**: Users can review products they've purchased
- **Search & Filters**: Find products by keyword, category, or brand
- **Admin Dashboard**: Manage products and view orders
- **Database**: PostgreSQL with Prisma ORM for type-safe queries

## 📋 Prerequisites

- **Node.js** v16 or higher
- **PostgreSQL** v12 or higher
- **npm** or **yarn**

## 🛠️ Quick Setup

### Option 1: Automated Setup (Windows)

```bash
cd server
setup.bat
```

### Option 2: Automated Setup (macOS/Linux)

```bash
cd server
chmod +x setup.sh
./setup.sh
```

### Option 3: Manual Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up PostgreSQL**:
   ```bash
   psql -U postgres
   CREATE DATABASE ecommerce_db;
   \q
   ```

3. **Configure environment**:
   - Copy `.env.example` to `.env`
   - Update with your PostgreSQL credentials

4. **Initialize Prisma**:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:5000`

## 📚 Available Commands

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Open Prisma Studio (interactive database viewer)
npx prisma studio
```

## 🗂️ Project Structure

```
server/
├── config/           # Database configuration
├── controllers/      # Business logic for routes
│   ├── admin/       # Admin operations
│   ├── auth/        # Authentication
│   ├── common/      # Shared features
│   └── shop/        # Shopping operations
├── lib/             # Utilities and helpers
│   └── prisma.js   # Prisma client instance
├── middlewares/     # Express middlewares
├── prisma/          # Prisma ORM files
│   ├── schema.prisma
│   └── migrations/
├── routes/          # API route definitions
│   ├── admin/
│   ├── auth/
│   ├── common/
│   └── shop/
├── .env             # Environment variables
├── .env.example     # Example environment file
├── package.json
└── server.js        # Main server file
```

## 🔌 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check-auth` - Verify authentication

### Admin Routes
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products/add` - Create product
- `PUT /api/admin/products/edit/:id` - Update product
- `DELETE /api/admin/products/delete/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/orders/:id` - Get order details
- `PUT /api/admin/orders/update/:id` - Update order status

### Shopping Routes
- `GET /api/shop/products` - Get all products
- `GET /api/shop/products/:id` - Get product details
- `GET /api/shop/search/:keyword` - Search products
- `POST /api/shop/cart/add` - Add to cart
- `GET /api/shop/cart/get/:userId` - Get user cart
- `PUT /api/shop/cart/update-cart` - Update cart
- `DELETE /api/shop/cart/delete/:userId/:productId` - Remove from cart
- `POST /api/shop/order/create` - Create order
- `GET /api/shop/order/list/:userId` - Get user orders
- `GET /api/shop/order/details/:id` - Get order details
- `PUT /api/shop/order/capture` - Capture payment
- `POST /api/shop/review/add-review` - Add review
- `GET /api/shop/review/get/:productId` - Get product reviews

### Common Routes
- `GET /api/common/feature` - Get features
- `POST /api/common/feature/add` - Add feature
- `DELETE /api/common/feature/delete/:id` - Delete feature

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce_db"

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Authentication
CLIENT_SECRET_KEY=your_jwt_secret_key

# PayPal
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
```

## 🗄️ Database Schema

The database includes the following models:

- **User**: User accounts with authentication
- **Product**: Product catalog with pricing and inventory
- **Cart**: Shopping cart for each user
- **Order**: Order records with payment information
- **Address**: Shipping addresses for users
- **Review**: Product reviews from users
- **Feature**: Featured products or banners

See `prisma/schema.prisma` for the complete schema.

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ CORS protection
- ✅ Environment variable protection
- ✅ SQL injection prevention (Prisma parameterized queries)

## 🐛 Troubleshooting

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running
```bash
# Windows
net start postgresql-x64-15

# macOS
brew services start postgresql

# Linux
sudo service postgresql start
```

### Database Not Found
```
Error: database "ecommerce_db" does not exist
```
**Solution**: Create the database
```bash
psql -U postgres -c "CREATE DATABASE ecommerce_db;"
```

### Prisma Client Not Generated
```
Error: @prisma/client did not initialize yet
```
**Solution**: Generate Prisma Client
```bash
npx prisma generate
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change PORT in `.env` or kill the process using port 5000

## 📖 Documentation

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Setup Guide](./SETUP_GUIDE.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

ISC License

## ✨ Support

For issues and questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the [Setup Guide](./SETUP_GUIDE.md)
3. Enable debug logging by setting `NODE_ENV=development`

---

**Happy coding! 🚀**
