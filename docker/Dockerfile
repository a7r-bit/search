FROM node:20-alpine

RUN apk add --no-cache bash openssl

WORKDIR /app

# только зависимости
COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
