# CRITICAL: Render Build Command Fix

## The Problem

Render is running **only** `npm install` as the build command, which:
- ✅ Installs dependencies
- ❌ Does NOT compile TypeScript
- ❌ Does NOT create `dist/server.js`
- ❌ Results in "Cannot find module" error

## The Solution

You **MUST** update the Build Command in your Render service settings.

### Step-by-Step Fix:

1. **Go to Render Dashboard**
   - Navigate to your backend service
   - Click on **Settings**

2. **Update Build Command**
   - Current (WRONG): `npm install`
   - Change to: `npm install && npm run build`
   - OR: `npm run postinstall && npm run build`

3. **Verify Start Command**
   - Should be: `node index.js`
   - OR if using rootDir: `npm start`

4. **Save and Redeploy**
   - Click **Save Changes**
   - Go to **Manual Deploy** → **Deploy latest commit**

## Alternative: Use Root Directory

Instead of root-level workaround, you can:

1. **Set Root Directory**: `apps/backend`
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`

This is the **recommended approach** and uses the `render.yaml` configuration.

## Why This Happens

Render's default build command is `npm install`, which only installs dependencies. It doesn't run the `build` script that compiles TypeScript. You need to explicitly tell Render to build the code.

## Verification

After updating, check the build logs. You should see:
```
> Running build command 'npm install && npm run build'...
> backend@1.0.0 build
> npx prisma generate && tsc
✔ Generated Prisma Client
```

If you see TypeScript compilation, the build is working correctly!
