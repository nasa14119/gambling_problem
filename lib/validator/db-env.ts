import { z } from "zod";
const ENV = z.object(
  {
    DATABASE_URL: z.string(),
    MYSQL_PORT: z.coerce.number(),
    MYSQL_DATABASE: z.string(),
  },
  "Env file not found for db please check the .env or un npm run init",
);
export const getEnv = (process: unknown) => ENV.parse(process);
