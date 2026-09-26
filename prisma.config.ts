import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/mysql-migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: (process.env.NOX_MYSQL_DATABASE_URL || process.env.DATABASE_URL)!,
  },
});
