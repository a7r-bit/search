import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: 'prisma/scheme',
    migrations: {
        path: 'prisma/migrations',
        seed: 'node prisma/seed.js',
    },
});
