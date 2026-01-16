FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY apps/backend/package*.json ./

# Copy Prisma files BEFORE npm ci (needed for postinstall script)
COPY apps/backend/prisma ./prisma
COPY apps/backend/prisma.config.ts ./

# Install all dependencies (including dev for build)
# postinstall will run prisma generate automatically
RUN npm ci

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
