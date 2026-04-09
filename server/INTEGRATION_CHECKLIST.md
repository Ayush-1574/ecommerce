# Server Integration Checklist

Use this checklist to verify that your Prisma and PostgreSQL integration is complete and working.

## ✅ Pre-Setup Checks

- [ ] Node.js is installed (`node --version`)
- [ ] PostgreSQL is installed and running
- [ ] You can connect to PostgreSQL with your credentials
- [ ] Port 5000 is available on your system

## ✅ Installation

- [ ] Run `npm install` in the server directory
- [ ] All dependencies installed without errors
- [ ] `.env` file is created with database credentials
- [ ] `DATABASE_URL` is properly formatted in `.env`

## ✅ Prisma Setup

- [ ] Run `npx prisma generate` successfully
- [ ] No errors in Prisma schema validation
- [ ] `node_modules/.prisma/client` directory exists
- [ ] `@prisma/client` is in the dependencies (not devDependencies)

## ✅ Database Initialization

- [ ] PostgreSQL database `ecommerce_db` exists
- [ ] Run `npx prisma migrate dev --name init` successfully
- [ ] All tables created in the database
- [ ] No migration errors in the output
- [ ] Can access Prisma Studio with `npx prisma studio` on port 5555

## ✅ Server Configuration

- [ ] `server.js` imports from `./lib/prisma`
- [ ] Test database connection message appears on server start
- [ ] `PORT` is defined in `.env` (default 5000)
- [ ] `NODE_ENV` is set to `development`
- [ ] `CLIENT_SECRET_KEY` is set to a secure value

## ✅ Code Integration

- [ ] No Sequelize imports in active controller files
- [ ] Controllers use `prisma.model.method()` syntax
- [ ] Auth controller uses `prisma.user` queries
- [ ] Shop controllers use Prisma methods
- [ ] Admin controllers use Prisma methods
- [ ] Search functionality updated to use Prisma's `mode: "insensitive"`

## ✅ Server Startup

- [ ] Run `npm run dev` or `node server.js`
- [ ] See message: "✓ PostgreSQL database connected successfully"
- [ ] See message: "🚀 Server is running on port 5000"
- [ ] No error messages in console
- [ ] Server doesn't crash on startup

## ✅ API Testing

- [ ] Can call `/api/auth/register` endpoint
- [ ] User data is stored in PostgreSQL
- [ ] Can retrieve user data from database
- [ ] Cart operations work
- [ ] Order operations work
- [ ] Product queries return results

## ✅ Database Health

- [ ] `npx prisma studio` opens successfully
- [ ] Can view all tables in Prisma Studio
- [ ] Can see data in tables (after testing APIs)
- [ ] No data corruption issues
- [ ] Relations between tables are maintained

## ✅ Error Handling

- [ ] Invalid database credentials show clear error
- [ ] Database connection timeout shows proper error
- [ ] API errors return proper JSON responses
- [ ] Server logs are descriptive and helpful
- [ ] No unhandled promise rejections

## ✅ Performance Checks

- [ ] Database queries respond within expected time
- [ ] No N+1 query problems visible in logs
- [ ] Prisma relations load correctly
- [ ] CORS is properly configured
- [ ] Rate limiting working as expected

## ✅ Data Persistence

- [ ] Data survives server restart
- [ ] Database connections close gracefully on shutdown
- [ ] No stale connections left in pool
- [ ] Migrations are tracked in database

## ✅ Documentation

- [ ] `.env.example` is up to date
- [ ] `SETUP_GUIDE.md` is complete and accurate
- [ ] `README_PRISMA.md` is comprehensive
- [ ] Setup scripts are executable and working
- [ ] All configuration options are documented

## 🔧 Troubleshooting Steps

If any checks fail:

1. **Connection errors**: Verify PostgreSQL is running
   ```bash
   psql -U postgres -c "SELECT 1;"
   ```

2. **Prisma errors**: Regenerate client
   ```bash
   npx prisma generate
   ```

3. **Migration errors**: Check migration status
   ```bash
   npx prisma migrate status
   ```

4. **Data issues**: Reset database (WARNING: deletes all data)
   ```bash
   npx prisma migrate reset
   ```

5. **Port conflicts**: Change PORT in `.env` or kill process
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # macOS/Linux
   lsof -i :5000
   ```

## 📞 Support Resources

- **Prisma Issues**: https://github.com/prisma/prisma/issues
- **PostgreSQL Help**: https://www.postgresql.org/support/
- **Express Errors**: https://expressjs.com/en/guide/error-handling.html

## ✨ Ready to Deploy?

Once all checks pass:

- [ ] Environment variables are secured
- [ ] Database backups are configured
- [ ] Logging is properly set up
- [ ] Error monitoring is enabled
- [ ] Performance monitoring is in place
- [ ] Database indexes are optimized
- [ ] Security headers are configured

---

**Last Updated**: 2026-04-08
**Status**: Ready for Development ✅
