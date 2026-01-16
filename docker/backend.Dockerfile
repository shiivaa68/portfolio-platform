FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY apps/backend/package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy Prisma files
COPY apps/backend/prisma ./prisma
COPY apps/backend/prisma.config.ts ./

# Generate Prisma Client
RUN npx prisma generate

# Copy source files
COPY apps/backend/src ./src
COPY apps/backend/tsconfig.json ./

# Build TypeScript
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/server.js"]
