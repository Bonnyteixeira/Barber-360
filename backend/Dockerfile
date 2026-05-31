# ====================================================
# STAGE 1: Build Phase
# ====================================================
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Install package descriptors first
COPY package*.json ./
RUN npm ci

# Copy core files and compile TypeScript configurations
COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# Remove development references
RUN npm prune --production

# ====================================================
# STAGE 2: Lightweight Runtime Execute Phase
# ====================================================
FROM node:20-slim

WORKDIR /usr/src/app

# Configure default Production variables
ENV NODE_ENV=production
ENV BACKEND_PORT=3500

# Copy output assets from Builder Stage
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder /usr/src/app/dist/ ./dist/

# Expose microservice communication port
EXPOSE 3500

# Run standard CommonJS runtime binary bundle
CMD ["node", "dist/src/index.js"]
