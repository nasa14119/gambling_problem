import { drizzle } from "drizzle-orm/mysql2";
import { env } from "env";
const { DATABASE_URL } = env;
export const db = drizzle(DATABASE_URL);
