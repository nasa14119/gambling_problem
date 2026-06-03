import { drizzle } from "drizzle-orm/mysql2";
import { env } from "#env";
import mysql from "mysql2/promise";

const client = await mysql.createConnection({
  user: "root", // MUST BE ROOT AND MUST BE PASSED IN THE CONNECTION PARAM
  host: env.MYSQL_HOST,
  port: env.MYSQL_PORT,
  password: env.MYSQL_ROOT_PASSWORD,
  database: env.MYSQL_DATABASE,
});
export const db = drizzle({ client });
