import { defineConfig } from "drizzle-kit";
import { env } from "env";

export default defineConfig({
  out: "./drizzle",
  schema: "./schema.ts",
  dialect: "mysql",
  dbCredentials: {
    user: "root",
    database: env.MYSQL_DATABASE,
    password: env.MYSQL_ROOT_PASSWORD,
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
  },
});
