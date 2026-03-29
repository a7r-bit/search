#!/bin/sh
set -e

echo "Waiting for Postgres..."
until pg_isready -h postgres -p 5432 -U postgres -d Search; do
  sleep 1
done

echo "Postgres is ready!"

echo "Running Prisma migrations..."
npx prisma migrate deploy
echo "Done!"

echo "Running prisma/seed.js..."
npx prisma db seed
echo "Done!"

echo "Starting NestJS..."
exec npm run start:prod