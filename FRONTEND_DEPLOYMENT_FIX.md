# Frontend Deployment Fix

## Problem: "Cannot GET /api/"

This error occurs when:
1. Frontend API URL is incorrect
2. Frontend is not deployed
3. Environment variable `VITE_API_URL` is not set during build

## Solution

### Step 1: Update Backend URL in render.yaml

The `render.yaml` has been updated with the correct backend URL:
- **Old**: `https://portfolio-backend.onrender.com/api`
- **New**: `https://portfolio-backend-dwkj.onrender.com/api`

### Step 2: Deploy Frontend to Render

#### Option A: Using Blueprint (render.yaml)

1. Go to **Render Dashboard**
2. Click **New +** → **Blueprint**
3. Connect your GitHub repository
4. Render will detect `render.yaml` and create both services
5. Make sure `VITE_API_URL` is set correctly

#### Option B: Manual Static Site Setup

1. Go to **Render Dashboard**
2. Click **New +** → **Static Site**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `portfolio-frontend`
   - **Root Directory**: `apps/frontend` (or leave blank if deploying from root)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. **Environment Variables**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://portfolio-backend-dwkj.onrender.com/api`
6. Click **Create Static Site**

### Step 3: Verify Environment Variable

**IMPORTANT**: Vite environment variables must be set **BEFORE** the build runs.

In Render:
1. Go to your Frontend service
2. Go to **Environment** tab
3. Add/Update:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://portfolio-backend-dwkj.onrender.com/api`
4. **Save Changes**
5. **Manual Deploy** → **Deploy latest commit**

### Step 4: Check Build Logs

After deployment, check the build logs. You should see:
```
> Running build command...
> Building for production...
✓ built in X.XXs
```

### Step 5: Verify Frontend is Working

1. Visit your frontend URL (from Render dashboard)
2. Open browser DevTools (F12) → Network tab
3. Check if API calls are going to:
   - ✅ `https://portfolio-backend-dwkj.onrender.com/api/projects`
   - ❌ NOT `http://localhost:4000/api` or `/api/`

## Common Issues

### Issue 1: "Cannot GET /api/"

**Cause**: Frontend is making requests to relative path `/api/` instead of full URL

**Fix**: 
- Check that `VITE_API_URL` is set in Render environment variables
- Rebuild the frontend after setting the variable
- Vite variables are embedded at build time, not runtime

### Issue 2: CORS Errors

**Cause**: Backend not allowing frontend domain

**Fix**: The backend already has `cors()` enabled, but verify:
- Backend `cors()` middleware is active
- Frontend URL is in allowed origins (if configured)

### Issue 3: Environment Variable Not Working

**Cause**: Vite variables must start with `VITE_` and be set before build

**Fix**:
1. Variable name must be `VITE_API_URL` (not `API_URL`)
2. Set in Render **before** building
3. Rebuild after setting variable

## Testing Locally

To test with the deployed backend:

1. Create `apps/frontend/.env.local`:
   ```
   VITE_API_URL=https://portfolio-backend-dwkj.onrender.com/api
   ```

2. Run:
   ```bash
   cd apps/frontend
   npm run dev
   ```

3. Visit `http://localhost:5173` (or the port Vite shows)

## Verification Checklist

- [ ] Frontend is deployed to Render
- [ ] `VITE_API_URL` is set in Render environment variables
- [ ] Frontend was rebuilt after setting `VITE_API_URL`
- [ ] Backend URL is correct: `https://portfolio-backend-dwkj.onrender.com`
- [ ] API calls in browser DevTools show correct backend URL
- [ ] No CORS errors in browser console
- [ ] Projects load on homepage
- [ ] Login works

## Quick Fix Command

If you need to rebuild with correct environment variable:

1. In Render Dashboard → Frontend Service
2. Go to **Environment** tab
3. Set `VITE_API_URL` = `https://portfolio-backend-dwkj.onrender.com/api`
4. **Save Changes**
5. **Manual Deploy** → **Deploy latest commit**
