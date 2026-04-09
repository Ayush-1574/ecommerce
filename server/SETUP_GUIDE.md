# E-Commerce Server Setup Guide

This guide will help you set up and run the E-Commerce server with Prisma ORM and PostgreSQL.

## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)

## Step 1: PostgreSQL Database Setup

### On Windows with PostgreSQL installer:

1. **Start PostgreSQL service** (if not auto-starting):
   - Search for "Services" on Windows
   - Find "postgresql-x64-..." and ensure it's running
   - Or use: `pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start`

2. **Create the database**:
   ```bash
   psql -U postgres
   ```
   Then in the PostgreSQL prompt:
   ```sql
   CREATE DATABASE ecommerce_db;
   \q
   ```

### On macOS (using Homebrew):

```bash
brew services start postgresql
psql postgres
CREATE DATABASE ecommerce_db;
\q
```

### On Linux (Ubuntu/Debian):

```bash
sudo service postgresql start
sudo -u postgres psql
CREATE DATABASE ecommerce_db;
\q
```

## Step 2: Install Dependencies

Navigate to the server directory and install all required packages:

```bash
cd c:\Users\ayush\Desktop\ecommerce\server
npm install
```

This will install:
- **Prisma** - ORM for database management
- **Express** - Web framework
- **dotenv** - Environment variables
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- And other dependencies

## Step 3: Configure Environment Variables

The `.env` file is already created. Update it with your PostgreSQL credentials:

```env
# Database Configuration (update if different from defaults)
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce_db"

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (generate a random string)
CLIENT_SECRET_KEY=your_random_jwt_secret_key_minimum_32_characters

# PayPal Configuration (optional, for testing)
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

**To generate a secure JWT secret**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Initialize Prisma and Database

### Generate Prisma Client:

```bash
npx prisma generate
```

### Run Migrations to Create Tables:

```bash
npx prisma migrate dev --name init
```

This will:
1. Create all database tables based on `prisma/schema.prisma`
2. Generate Prisma Client for database queries
3. Create a migration file in `prisma/migrations/`

### Verify Database:

View the database schema:
```bash
npx prisma studio
```

This opens an interactive database viewer at `http://localhost:5555`

## Step 5: Run the Server

### Development Mode (with auto-restart):

```bash
npm run dev
```

Expected output:
```
✓ PostgreSQL database connected successfully

🚀 Server is running on port 5000
📝 Environment: development
```

### Production Mode:

```bash
npm start
```

## Step 6: Verify Server is Working

Test the API health:

```bash
curl http://localhost:5000/api/auth
```

Or use tools like [Postman](https://www.postman.com/downloads/) or [Thunder Client](https://www.thunderclient.com/)

## Database Management Commands

### View Database Schema (Interactive UI):
```bash
npx prisma studio
```

### Create a New Migration (after schema changes):
```bash
npx prisma migrate dev --name describe_your_changes
```

### Apply Pending Migrations:
```bash
npx prisma migrate deploy
```

### Reset Database (⚠️ Deletes all data):
```bash
npx prisma migrate reset
```

### Generate Seed Data (if seed file exists):
```bash
npx prisma db seed
```

## API Endpoints

Once the server is running, you can access these endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check-auth` - Check authentication status

### Admin Products
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products/add` - Add new product
- `PUT /api/admin/products/edit/:id` - Edit product
- `DELETE /api/admin/products/delete/:id` - Delete product

### Shopping Products
- `GET /api/shop/products` - Get all products for shopping
- `GET /api/shop/products/:id` - Get product details

### Cart
- `POST /api/shop/cart/add` - Add to cart
- `GET /api/shop/cart/get/:userId` - Get user's cart
- `PUT /api/shop/cart/update-cart` - Update cart items
- `DELETE /api/shop/cart/delete/:userId/:productId` - Remove from cart

### Orders
- `POST /api/shop/order/create` - Create new order
- `GET /api/shop/order/details/:id` - Get order details
- `GET /api/shop/order/list/:userId` - Get user's orders
- `PUT /api/shop/order/capture` - Capture payment

### Reviews
- `POST /api/shop/review/add-review` - Add product review
- `GET /api/shop/review/get/:productId` - Get product reviews

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
- **Cause**: PostgreSQL is not running
- **Solution**: Start PostgreSQL service
  ```bash
  # Windows
  net start postgresql-x64-15
  
  # macOS
  brew services start postgresql
  
  # Linux
  sudo service postgresql start
  ```

### Error: "database \"ecommerce_db\" does not exist"
- **Solution**: Create the database
  ```bash
  psql -U postgres -c "CREATE DATABASE ecommerce_db;"
  ```

### Error: "Prisma Client not generated"
- **Solution**: Generate Prisma Client
  ```bash
  npx prisma generate
  ```

### Migrations not applied
- **Solution**: Run migrations manually
  ```bash
  npx prisma migrate deploy
  ```

### Port 5000 already in use
- **Solution**: Change PORT in `.env` or kill the process using port 5000
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -i :5000
  kill -9 <PID>
  ```

## Project Structure

```
server/
├── config/
│   └── database.js              # Database configuration
├── controllers/
│   ├── admin/                   # Admin operations
│   ├── auth/                    # Authentication logic
│   ├── common/                  # Common features
│   └── shop/                    # Shopping operations
├── lib/
│   └── prisma.js               # Prisma client instance
├── middlewares/
│   ├── cloudinary.js           # Image upload middleware
│   └── paypal.js               # PayPal integration
├── models/                      # (Deprecated - use Prisma schema)
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── routes/
│   ├── admin/                  # Admin routes
│   ├── auth/                   # Auth routes
│   ├── common/                 # Common routes
│   └── shop/                   # Shop routes
├── .env                         # Environment variables
├── package.json                 # Dependencies
└── server.js                    # Main server file
```

## Next Steps

1. **Set up the client**: Navigate to the `client/` folder and run `npm install && npm run dev`
2. **Seed sample data**: Create a seed script in `prisma/seed.js` for initial data
3. **Add validation**: Implement input validation middleware
4. **Setup authentication**: Configure JWT tokens properly
5. **Error handling**: Enhance error handling and logging

## Support

For issues with:
- **Prisma**: Visit [Prisma Documentation](https://www.prisma.io/docs/)
- **PostgreSQL**: Visit [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- **Express**: Visit [Express Documentation](https://expressjs.com/)

---

**Happy coding! 🚀**
