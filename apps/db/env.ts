import { getEnv } from "@repo/validator/db-env";
// process.loadEnvFile();
export const env = getEnv(process.env);
