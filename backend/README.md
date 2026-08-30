# Dot Inspire Design Studio — Backend REST API

Express.js MVC TypeScript REST API with Prisma ORM targeting PostgreSQL (Neon).

## 🚀 Setup & Run

1. Copy `.env.example` to `.env`:
   ```bash
   NODE_ENV=development
   PORT=5000
   DATABASE_URL="YOUR_NEON_POSTGRES_CONNECTION_STRING"
   JWT_SECRET="YOUR_LONG_RANDOM_JWT_SECRET"
   FRONTEND_URL="http://localhost:5173"
   CLOUDINARY_CLOUD_NAME="YOUR_CLOUDINARY_CLOUD_NAME"
   CLOUDINARY_API_KEY="YOUR_CLOUDINARY_API_KEY"
   CLOUDINARY_API_SECRET="YOUR_CLOUDINARY_API_SECRET"
   ADMIN_EMAIL="dotinspire787@gmail.com"
   ADMIN_PASSWORD="AdminPassword123!"
   ```
2. Install dependencies & run Prisma setup:
   ```bash
   npm install
   npx prisma generate
   npx prisma db seed
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
