# --- builder ---
FROM dockerhub.mingas.by/node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npm run build
RUN npm ci --omit=dev && npm cache clean --force

# --- runner ---
FROM dockerhub.mingas.by/node:22-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]


