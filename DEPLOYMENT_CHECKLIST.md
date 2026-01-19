# Complete Deployment Checklist for Render & Vercel

## 🚨 CRITICAL BUGS FIXED

### 1. ✅ Backend Routes Not Registered (FIXED)
**Problem**: API routes (`/api/auth` and `/api/projects`) were imported but never registered in `app.ts`
**Fix**: Added route registration:
```typescript
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
```

### 2. ✅ CORS Configuration Improved (FIXED)
**Problem**: Basic CORS without proper origin handling
**Fix**: Enhanced CORS with proper origin configuration for production

---

## 📋 RENDER DEPLOYMENT CHECKLIST

### Backend Service (Render)

#### ✅ Service Configuration
- [ ] **Service Type**: Web Service (Node.js)
- [ ] **Name**: `portfolio-backend`
- [ ] **Root Directory**: `apps/backend`
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Start Command**: `npm start`
- [ ] **Health Check Path**: `/health`

#### ✅ Environment Variables
Set these in Render Dashboard → Environment tab:

1. **NODE_ENV**
   - Value: `production`
   - Type: Plain text

2. **PORT**
   - Value: `10000` (Render default)
   - Type: Plain text

3. **DATABASE_URL**
   - Value: Your PostgreSQL connection string from Render
   - Format: `postgresql://user:password@host:port/database`
   - Type: Secret
   - ⚠️ **IMPORTANT**: Use Internal Database URL if database is on Render

4. **JWT_SECRET**
   - Value: A strong random string (e.g., generate with `openssl rand -base64 32`)
   - Type: Secret
   - ⚠️ **IMPORTANT**: Must be the same if you have existing tokens

5. **FRONTEND_URL** (Optional but recommended)
   - Value: Your frontend URL (e.g., `https://portfolio-frontend.onrender.com`)
   - Type: Plain text
   - Purpose: For CORS configuration

#### ✅ Database Setup
1. Create PostgreSQL database in Render
2. Copy **Internal Database URL** (not external)
3. Set as `DATABASE_URL` in backend environment variables
4. Run migrations:
   ```bash
   # In Render shell or locally with DATABASE_URL set
   cd apps/backend
   npx prisma migrate deploy
   ```

#### ✅ Verification Steps
1. Check backend URL: `https://portfolio-backend-dwkj.onrender.com/health`
   - Should return: `{"status":"ok","message":"Server is running"}`
2. Check database connection: `https://portfolio-backend-dwkj.onrender.com/api/db/status`
   - Should return database info
3. Check API routes:
   - `https://portfolio-backend-dwkj.onrender.com/api/projects` (GET)
   - Should return: `[]` (empty array) or list of projects

---

### Frontend Service (Render)

#### ✅ Service Configuration
- [ ] **Service Type**: Static Site
- [ ] **Name**: `portfolio-frontend`
- [ ] **Root Directory**: `apps/frontend` (or leave blank if deploying from root)
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Publish Directory**: `dist`

#### ✅ Environment Variables
**CRITICAL**: Vite environment variables must be set **BEFORE** the build runs!

1. **VITE_API_URL**
   - Value: `https://portfolio-backend-dwkj.onrender.com/api`
   - Type: Plain text
   - ⚠️ **MUST** start with `VITE_` prefix
   - ⚠️ **MUST** be set before building

#### ✅ Build Process
1. Set `VITE_API_URL` in Environment tab
2. **Save Changes**
3. **Manual Deploy** → **Deploy latest commit**
4. Wait for build to complete

#### ✅ Verification Steps
1. Visit frontend URL
2. Open browser DevTools (F12) → Network tab
3. Check API calls:
   - Should go to: `https://portfolio-backend-dwkj.onrender.com/api/projects`
   - Should NOT be: `/api/` or `http://localhost:4000/api`
4. Check for CORS errors in Console tab
5. Test login functionality
6. Test project display on homepage

---

## 📋 VERCEL DEPLOYMENT CHECKLIST

### Frontend on Vercel (Alternative to Render)

#### ✅ Project Configuration
- [ ] **Framework Preset**: Vite
- [ ] **Root Directory**: `apps/frontend`
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `dist`
- [ ] **Install Command**: `npm install`

#### ✅ Environment Variables
Set in Vercel Dashboard → Settings → Environment Variables:

1. **VITE_API_URL**
   - Value: `https://portfolio-backend-dwkj.onrender.com/api`
   - Environment: Production, Preview, Development
   - ⚠️ **MUST** start with `VITE_` prefix

#### ✅ Build Settings
- [ ] Framework: Vite
- [ ] Node.js Version: 18.x or 20.x
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

#### ✅ Verification Steps
1. Deploy to Vercel
2. Check deployment logs for build success
3. Visit deployed URL
4. Verify API calls in Network tab
5. Test all functionality

---

## 🔍 TROUBLESHOOTING GUIDE

### Error: "Cannot GET /api/"

**Causes:**
1. Backend routes not registered (✅ FIXED)
2. Frontend API URL incorrect
3. Backend not deployed/running

**Solutions:**
1. ✅ Verify routes are registered in `app.ts`
2. Check `VITE_API_URL` is set correctly
3. Verify backend is running: `https://your-backend.onrender.com/health`
4. Check backend logs in Render dashboard

### Error: CORS Policy

**Causes:**
1. Frontend URL not in CORS allowed origins
2. CORS middleware not configured properly

**Solutions:**
1. ✅ CORS is now configured to allow all origins in development
2. Set `FRONTEND_URL` in backend environment variables
3. Check backend CORS configuration in `app.ts`

### Error: "Network Error" or "Failed to fetch"

**Causes:**
1. Backend URL incorrect
2. Backend not accessible
3. CORS blocking request

**Solutions:**
1. Verify `VITE_API_URL` matches actual backend URL
2. Test backend health endpoint
3. Check browser console for CORS errors
4. Verify backend is deployed and running

### Error: "401 Unauthorized"

**Causes:**
1. Token not sent in request
2. Token expired or invalid
3. JWT_SECRET mismatch

**Solutions:**
1. Check Authorization header is sent: `Bearer <token>`
2. Verify token in localStorage
3. Check `JWT_SECRET` matches between environments
4. Try logging in again

### Error: "Database connection failed"

**Causes:**
1. `DATABASE_URL` incorrect
2. Database not accessible
3. Migrations not run

**Solutions:**
1. Verify `DATABASE_URL` is set correctly
2. Use Internal Database URL if database is on Render
3. Run migrations: `npx prisma migrate deploy`
4. Check database is running in Render dashboard

---

## ✅ FINAL VERIFICATION CHECKLIST

### Backend
- [ ] Backend deployed to Render
- [ ] Health check works: `/health`
- [ ] Database connected: `/api/db/status`
- [ ] API routes work: `/api/projects` (GET)
- [ ] Auth route works: `/api/auth/login` (POST)
- [ ] CORS allows frontend origin
- [ ] Environment variables set correctly

### Frontend
- [ ] Frontend deployed (Render or Vercel)
- [ ] `VITE_API_URL` set correctly
- [ ] Build completed successfully
- [ ] Homepage loads projects
- [ ] Login works
- [ ] Admin panel accessible
- [ ] No CORS errors in console
- [ ] API calls go to correct backend URL

### Integration
- [ ] Frontend can fetch projects from backend
- [ ] Login creates and stores token
- [ ] Authenticated requests work
- [ ] Create/Delete projects work
- [ ] No network errors in browser console

---

## 📝 QUICK REFERENCE

### Backend URLs
- Health: `https://portfolio-backend-dwkj.onrender.com/health`
- API Base: `https://portfolio-backend-dwkj.onrender.com/api`
- Projects: `https://portfolio-backend-dwkj.onrender.com/api/projects`
- Auth: `https://portfolio-backend-dwkj.onrender.com/api/auth/login`

### Environment Variables Summary

**Backend (Render):**
```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://portfolio-frontend.onrender.com (optional)
```

**Frontend (Render/Vercel):**
```
VITE_API_URL=https://portfolio-backend-dwkj.onrender.com/api
```

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Test All Features**
   - Create a test user account
   - Add test projects
   - Verify CRUD operations

2. **Monitor Logs**
   - Check Render logs for errors
   - Monitor database connections
   - Watch for CORS issues

3. **Set Up Custom Domains** (Optional)
   - Configure custom domain in Render
   - Update `VITE_API_URL` if backend domain changes
   - Update CORS origins if needed

4. **Security Hardening**
   - Use strong `JWT_SECRET`
   - Enable HTTPS (automatic on Render/Vercel)
   - Review CORS origins in production
   - Add rate limiting if needed
