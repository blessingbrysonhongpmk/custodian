FROM node:24-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@11.24.0

# Copy workspace configuration and lockfile
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json tsconfig.json ./

# Copy all packages
COPY artifacts ./artifacts
COPY lib ./lib
COPY scripts ./scripts

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Runtime Stage
FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

RUN npm install -g pnpm@11.24.0

COPY --from=builder /app ./

EXPOSE 5000 5173

CMD ["node", "./scripts/start-all.mjs"]
