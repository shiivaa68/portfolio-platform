# Render Database Connection Fix

## ✅ Backend Deployed Successfully!

Your backend is now live at: `https://portfolio-backend-dwkj.onrender.com`

## 🚨 Database Connection Issue

The error shows:
```
Can't reach database server at postgres
```

This means your `DATABASE_URL` environment variable is set to a Docker hostname instead of your Render PostgreSQL database URL.

## 🔧 How to Fix

### Step 1: Create PostgreSQL Database in Render

1. Go to **Render Dashboard**
2. Click **New +** → **PostgreSQL**
3. Fill in:
   - **Name**: `portfolio-db` (or any name)
   - **Database**: `portfolio` (or any name)
   - **User**: (auto-generated)
   - **Region**: Choose closest to your backend
   - **Plan**: Free (or paid)
4. Click **Create Database**

### Step 2: Get Database Connection String

1. Once created, click on your database
2. Go to **Connections** tab
3. Copy the **Internal Database URL** (for services in same region)
   - Format: `postgresql://user:password@hostname:5432/database`
   - OR use **External Database URL** if needed

### Step 3: Set DATABASE_URL in Backend Service

1. Go to your **Backend Service** in Render
2. Go to **Environment** tab
3. Find `DATABASE_URL` variable
4. **Update** it with the Internal Database URL from Step 2
5. Click **Save Changes**

### Step 4: Run Database Migrations

After setting DATABASE_URL, you need to run Prisma migrations:

**Option A: Using Render Shell (Recommended)**
1. Go to your Backend Service
2. Click **Shell** tab
3. Run:
   ```bash
   cd apps/backend
   npx prisma migrate deploy
   ```
   Or for development:
   ```bash
   npx prisma migrate dev
   ```

**Option B: Add to Build Command**
Update your Build Command to:
```bash
npm install && npm run build && cd apps/backend && npx prisma migrate deploy
```

### Step 5: Verify Connection

1. Visit: `https://portfolio-backend-dwkj.onrender.com/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. Visit: `https://portfolio-backend-dwkj.onrender.com/api/db/status`
   - Should return database connection info (after DATABASE_URL is fixed)

## 📋 Environment Variables Checklist

Make sure these are set in your Backend Service:

- ✅ `DATABASE_URL` - Your Render PostgreSQL Internal URL
- ✅ `JWT_SECRET` - A secure random string (e.g., generate with `openssl rand -base64 32`)
- ✅ `NODE_ENV` - Set to `production`
- ✅ `PORT` - Usually auto-set by Render (10000)

## 🔍 Troubleshooting

### Still Getting "Can't reach database server"?

1. **Check DATABASE_URL format:**
   - Should start with `postgresql://`
   - Should NOT contain `postgres` as hostname (that's Docker)
   - Should be the Render database hostname

2. **Verify database is running:**
   - Check Render dashboard → Database → Status should be "Available"

3. **Check network access:**
   - Use **Internal Database URL** if backend and database are in same region
   - Use **External Database URL** if they're in different regions

4. **Check migrations:**
   - Make sure you've run `prisma migrate deploy` to create tables

## ✅ Success Indicators

When everything is working:
- ✅ `/health` endpoint returns success
- ✅ `/api/db/status` shows connected database
- ✅ No "Can't reach database server" errors in logs
- ✅ You can create users and projects via API
