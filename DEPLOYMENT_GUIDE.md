# Deployment Guide

## Render.com Deployment

### Backend Deployment

1. **Root Directory**: Set to `apps/backend`
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `PORT` - Port number (Render sets this automatically)
   - `NODE_ENV` - Set to `production`

### Frontend Deployment

1. **Root Directory**: Set to `apps/frontend`
2. **Build Command**: `npm install && npm run build`
3. **Publish Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL` - Your backend API URL (e.g., `https://your-backend.onrender.com/api`)

## Docker Deployment

### Fix Port Conflict

The Docker compose uses port 5436 for PostgreSQL to avoid conflicts.

### Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Rebuild and restart
docker compose up -d --build
```

### Environment Variables

Create a `.env` file in the root directory with:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=portfolio
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/portfolio
PORT=4000
JWT_SECRET=your-secret-key
NODE_ENV=production
```

## Troubleshooting

### Port 5432 Already in Use

The docker-compose.yml uses port 5436 instead. If you need to change it, update the port mapping.

### Render Deployment Error

Make sure:
- Root directory is set correctly (`apps/backend` or `apps/frontend`)
- Build command includes `npm run build`
- Start command uses `npm start` (which runs `node dist/server.js`)
- All environment variables are set
