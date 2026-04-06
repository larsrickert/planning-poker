import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    database: process.env.NUXT_POSTGRES_DB!,
    user: process.env.NUXT_POSTGRES_USER!,
    password: process.env.NUXT_POSTGRES_PASSWORD!,
    host: process.env.NUXT_POSTGRES_HOST!,
    ssl: process.env.NUXT_POSTGRES_HOST !== "localhost",
  },
});
