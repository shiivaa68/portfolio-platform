# Render.com Deployment Instructions

## Backend Deployment

### Service Settings:
1. **Service Type**: Web Service
2. **Root Directory**: `apps/backend`
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Node Version**: 20 (or latest LTS)

### Environment Variables:
- `DATABASE_URL` - Your PostgreSQL connection string from Render database
- `JWT_SECRET` - A secure random string for JWT tokens
- `NODE_ENV` - Set to `production`
- `PORT` - Automatically set by Render (don't set manually)

### Database Setup:
1. Create a PostgreSQL database in Render
2. Copy the Internal Database URL
3. Set it as `DATABASE_URL` in backend service environment variables

## Frontend Deployment

### Service Settings:
1. **Service Type**: Static Site
2. **Root Directory**: `apps/frontend`
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist`

### Environment Variables:
- `VITE_API_URL` - Your backend URL (e.g., `https://portfolio-backend.onrender.com/api`)

## Important Notes

1. **Root Directory**: Must be set to `apps/backend` or `apps/frontend` (not the repo root)
2. **Build Command**: Must include `npm run build` to compile TypeScript
3. **Start Command**: Uses `npm start` which runs `node dist/server.js`
4. **Database**: Use Render's PostgreSQL service for production

## Troubleshooting

If you get "Cannot find module" errors:
- Check that Root Directory is set correctly
- Verify build command runs successfully
- Ensure all environment variables are set
