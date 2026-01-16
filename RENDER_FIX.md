# Render Deployment Fix Instructions

## Problem
Render is trying to run `node index.js` from root but can't find the backend server.

## Solution Applied
Created root-level `package.json` and `index.js` files that work with Render's default deployment process.

## Two Options to Fix

### Option 1: Update Render Service Settings (RECOMMENDED)

Go to your Render dashboard → Backend Service → Settings:

1. **Root Directory**: `apps/backend`
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `DATABASE_URL` (your PostgreSQL connection string)
   - `JWT_SECRET` (secure random string)
   - `NODE_ENV=production`
   - `PORT=10000` (or let Render set it automatically)

Then **Save Changes** and **Manual Deploy** → **Deploy latest commit**

### Option 2: Use Root-Level Workaround (Current Setup)

If you can't change the Root Directory, the root-level files will work, but you need to:

1. **Set Build Command** in Render dashboard:
   ```
   npm run build
   ```

2. **Set Start Command** (should default to `node index.js`):
   ```
   node index.js
   ```

3. **Keep Root Directory** as: `/` (root)

## How It Works

**Root package.json:**
- `postinstall`: Installs backend dependencies after root npm install
- `build`: Builds the backend TypeScript code
- `start`: Starts the server via index.js

**Root index.js:**
- Loads the compiled backend server from `apps/backend/dist/server.js`

## Verification

After deployment, check:
- ✅ Build completes successfully
- ✅ Server starts without "Cannot find module" errors
- ✅ Health endpoint works: `https://your-backend.onrender.com/health`

## Still Having Issues?

1. Check Render build logs for errors
2. Verify all environment variables are set
3. Ensure database is accessible from Render
4. Check that `apps/backend/dist/server.js` exists after build
