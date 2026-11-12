FROM dockerhub.mingas.by/node:22-slim

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]


