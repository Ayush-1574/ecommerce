# MongoDB to PostgreSQL Migration Guide

## Overview
Your MERN e-commerce application has been successfully migrated from MongoDB with Mongoose to PostgreSQL with Sequelize ORM.

## Key Changes Made

### 1. **Dependencies Updated**
- Removed: `mongoose` (v8.5.3)
- Added: `sequelize` (latest), `pg`, `pg-hstore`

**Installation command used:**
```bash
npm install sequelize pg pg-hstore
```

### 2. **Database Configuration**
- **New file:** `server/config/database.js`
  - Creates Sequelize connection to PostgreSQL
  - Configurable via environment variables
  - Auto-sync models with `alter: true` (development mode)

### 3. **Models Converted**
All Mongoose schemas converted to Sequelize models:

| Model | Changes |
|-------|---------|
| User | UUID primary key, unique constraints on email/username |
| Product | Decimal types for prices, FLOAT for averageReview |
| Cart | Items stored as JSONB array, belongs to User |
| Order | cartItems & addressInfo stored as JSONB, belongs to User |
| Address | UUID primary key, belongs to User |
| Review | UUID primary key, belongs to Product and User |
| Feature | UUID primary key, stores feature images |

### 4. **Query Migrations**

#### Database Operations:
- `Model.create()` - replaces `new Model()` + `.save()`
- `Model.findAll()` - replaces `Model.find()`
- `Model.findByPk(id)` - replaces `Model.findById(id)`
- `Model.findOne({where: {...}})` - replaces `Model.findOne({...})`
- `Model.update()` - replaces direct property assignments + `.save()`
- `instance.destroy()` - replaces `Model.findByIdAndDelete(id)`
- `Op.iLike` - case-insensitive search (replaces regex)
- `Op.in` - array queries (replaces MongoDB `$in`)

#### Associations (instead of Mongoose populate):
- Cart → User: `Cart.belongsTo(User, { foreignKey: "userId" })`
- Order → User: `Order.belongsTo(User, { foreignKey: "userId" })`
- Address → User: `Address.belongsTo(User, { foreignKey: "userId" })`
- Review → Product & User: `Review.belongsTo(Product/User)`

### 5. **Controllers Updated**

All controllers have been updated with Sequelize queries:
- ✅ `auth/auth-controller.js` - User registration/login
- ✅ `admin/products-controller.js` - Product CRUD operations
- ✅ `shop/products-controller.js` - Product filtering & search
- ✅ `shop/cart-controller.js` - Cart operations (JSONB items)
- ✅ `shop/order-controller.js` - Order creation & payment capture
- ✅ `admin/order-controller.js` - Order management
- ✅ `shop/address-controller.js` - Address CRUD
- ✅ `shop/product-review-controller.js` - Product reviews
- ✅ `common/feature-controller.js` - Feature image management
- ✅ `shop/search-controller.js` - Product search with iLike

## Setup Instructions

### 1. **Install PostgreSQL**
Download and install PostgreSQL 12+ from https://www.postgresql.org/download/

### 2. **Create Database**
```sql
CREATE DATABASE ecommerce_db;
```

### 3. **Environment Configuration**
Create `.env` file in `server/` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
NODE_ENV=development
CLIENT_SECRET_KEY=CLIENT_SECRET_KEY
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

### 4. **Install Dependencies**
```bash
cd server
npm install
```

### 5. **Start Server**
```bash
npm run dev
```

The server will automatically create all tables and sync the schema on first run.

## Important Differences from MongoDB

### ID Management
- **Mongoose:** ObjectId (_id)
- **Sequelize:** UUID (more PostgreSQL native)

Update frontend code to use `user.id` instead of `user._id`

### JSON Storage
For complex nested data (cartItems, addressInfo), we use PostgreSQL JSONB:
- Stored as JSON in database
- Accessed as JavaScript objects in code
- Queryable in PostgreSQL

### Array Operations
```javascript
// Old (Mongoose)
cart.items.push({ productId, quantity })
cart.items = cart.items.filter(...)

// New (Sequelize with JSONB)
let items = cart.items || []
items.push({ productId, quantity })
await cart.update({ items })
```

### Relationships
```javascript
// Old (Mongoose populate)
const cart = await Cart.findOne({userId}).populate("items.productId")

// New (Sequelize includes)
// Or manual joins in controller for JSONB items
const cart = await Cart.findOne({where: {userId}})
const items = cart.items // Already in cart object
for (let item of items) {
  const product = await Product.findByPk(item.productId)
}
```

### Search Queries
```javascript
// Old (Mongoose regex)
const regex = new RegExp(keyword, "i")
const results = await Product.find({title: regex})

// New (Sequelize Op.iLike)
const results = await Product.findAll({
  where: {
    title: {[Op.iLike]: `%${keyword}%`}
  }
})
```

## Manual Frontend Updates Required

1. **Replace all `._id` references with `.id`:**
   ```javascript
   // Old
   const userId = user._id
   
   // New
   const userId = user.id
   ```

2. **Check auth token payload:**
   - The JWT token structure remains the same but uses `.id` instead of `._id`
   - No changes needed to auth logic, just variable names

3. **Update URL parameters:**
   - All API endpoints remain the same
   - Only internal ID references change

## Troubleshooting

### Error: "Database connection failed"
- Ensure PostgreSQL is running
- Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` in `.env`
- Verify database `ecommerce_db` exists

### Error: "Table doesn't exist"
- Delete `.env` and restart - this will re-sync all tables
- Or: `ALTER TABLE ... DROP CONSTRAINT ...` for specific issues

### Error: "UUID not recognized"
- Ensure Sequelize UUID DataType is imported correctly
- Check migrations ran successfully

## Switching from Development to Production

### For Production:
1. Set `NODE_ENV=production`
2. Change `logging: false` in `database.js` (already set)
3. Use connection pooling settings:
   ```javascript
   pool: {
     max: 10,
     min: 2,
     acquire: 30000,
     idle: 10000,
   }
   ```
4. Set `alter: false` in `sequelize.sync()` to prevent auto-migrations

## Next Steps

1. ✅ Test all API endpoints with Postman/Insomnia
2. ✅ Update frontend to use `.id` instead of `._id`
3. ✅ Verify PayPal integration still works
4. ✅ Test file uploads (Cloudinary integration)
5. ✅ Run comprehensive tests
6. ✅ Deploy to production

## Additional Resources

- Sequelize Documentation: https://sequelize.org/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Sequelize Data Types: https://sequelize.org/docs/v6/other-topics/data-types/
- Sequelize Operators: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
