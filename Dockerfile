# ─────────────────────────────────────────────────────────────
#  Hisab Backend — Production Dockerfile
#  The Draftsman's Ledger API
# ─────────────────────────────────────────────────────────────

FROM node:20-bookworm-slim AS base

# Install curl for container HEALTHCHECK
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set production environment
ENV NODE_ENV=production \
    PORT=5000

# Install production dependencies first (layer caching)
COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force

# Copy application source code
COPY . .

# Ensure upload directory and storage directory exist with correct permissions for node user
RUN mkdir -p /app/uploads /app/data \
    && chown -R node:node /app

# Run as non-root user for security
USER node

# Expose default API port
EXPOSE 5000

# Container healthcheck querying the /api/v1/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:5000/api/v1/health || exit 1

# Start the ledger backend server
CMD ["node", "src/server.js"]

