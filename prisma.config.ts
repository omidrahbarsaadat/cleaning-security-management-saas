import { defineConfig } from "prisma/config";

// `prisma generate` (build, typecheck) needs no database, so the URL is only
// required by commands that connect, such as migrate and seed.
const url = process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  ...(url ? { datasource: { url } } : {}),
});
