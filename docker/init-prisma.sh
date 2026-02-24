#!/bin/sh
set -e

echo "Waiting for Postgres..."
until pg_isready -h postgres -p 5432 -U postgres -d Search; do
  sleep 1
done

echo "Postgres is ready!"

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Adding DEFAULT gen_random_uuid() to all 'id' columns..."
psql "postgresql://postgres:postgres@postgres:5432/Search" <<'EOSQL'
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE roles ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE permissions ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE document_versions ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE media_file ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE nodes ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE liked_nodes ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE refresh_tokens ALTER COLUMN id SET DEFAULT gen_random_uuid();
EOSQL

echo "Starting NestJS..."
exec npm run start:dev 