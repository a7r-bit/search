FROM node:20-alpine

RUN apk add postgresql-client

WORKDIR /app

# только зависимости
COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

RUN chmod +x ./docker/init-prisma.sh


ENTRYPOINT ["sh", "./docker/init-prisma.sh"]