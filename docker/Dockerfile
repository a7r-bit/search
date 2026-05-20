# --- builder ---
FROM dockerhub.mingas.by/node:22 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npm run build
RUN npm ci --omit=dev && npm cache clean --force

# --- runner ---
FROM dockerhub.mingas.by/node:22 AS runner

RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY docker/init-prisma.sh ./docker/init-prisma.sh

RUN chmod +x ./docker/init-prisma.sh

EXPOSE 3000

ENTRYPOINT ["sh", "./docker/init-prisma.sh"]
