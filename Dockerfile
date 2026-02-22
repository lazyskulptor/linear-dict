# ─── Stage 1: Install & Build ─────────────────────────────────
FROM node:22.4-alpine AS builder

ENV ADAPTER="node"

WORKDIR /app

# install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# build your SvelteKit app
COPY . .
RUN npm run build

# ─── Stage 2: Production Server ───────────────────────────────
FROM node:22.4-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# copy built output
COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["node", "build/index.js"]
