import { defineConfig } from "drizzle-kit";
import { env } from "env";
export default defineConfig({
  out: "./drizzle",
  schema: "./schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
    database: env.DATABASE_URL,
  },
});
