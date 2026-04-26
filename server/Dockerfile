FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Expose backend port
EXPOSE 5000

# Push DB schema (if needed) and start server
# Note: In production, db push should ideally be handled separately 
# or via migration scripts, but for development/orchestration, this works well.
CMD ["sh", "-c", "npx prisma db push && npm start"]
