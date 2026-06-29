# ──────────────────────────────────────────────────────────────
# Stage 1 – production dependencies
# Only re-runs when package-lock.json changes.
# ──────────────────────────────────────────────────────────────
FROM node:24-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

# ──────────────────────────────────────────────────────────────
# Stage 2 – TypeScript build
# Installs devDependencies, compiles to dist/, then discards
# the dev node_modules — they never reach the final image.
# ──────────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY tsconfig*.json ./
COPY src ./src

RUN npm run build

# ──────────────────────────────────────────────────────────────
# Stage 3 – minimal runtime image
# Only dist/ + production node_modules; no TypeScript toolchain.
# ──────────────────────────────────────────────────────────────
FROM node:24-alpine AS runtime

RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
COPY package.json .

USER appuser

EXPOSE 8000

CMD ["node", "dist/main.js"]
