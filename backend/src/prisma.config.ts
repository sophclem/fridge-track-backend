import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // This is where Prisma CLI (migrate/generate) gets the DB URL
    url: env('DATABASE_URL'),
  },
});
