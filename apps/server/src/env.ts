type Env = {
  MODE: "development" | "production";
  PORT: number;
  SERVER_PATH: string;
};
export const env: Env = {
  MODE: (process.env.NODE_ENV as Env["MODE"]) ?? "development",
  PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000,
  SERVER_PATH: process.env.SERVER_PATH ?? "",
} as const;
export default env;
