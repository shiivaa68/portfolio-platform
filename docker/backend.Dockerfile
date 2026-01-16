FROM node:20-alpine

WORKDIR /app

COPY apps/backend/package*.json ./
RUN npm install

# Copy all source files
COPY apps/backend .

# Generate Prisma Client inside container
RUN npx prisma generate

# Build TypeScript
RUN npm run build

EXPOSE 4000
CMD ["node", "dist/server.js"]
