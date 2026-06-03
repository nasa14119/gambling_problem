type Env = {
  JWT_SECRET: string;
  MODE: "development" | "production";
  PORT: number;
  SERVER_PATH: string;
};
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}
export const env: Env = {
  JWT_SECRET: process.env.JWT_SECRET,
  MODE: (process.env.NODE_ENV as Env["MODE"]) ?? "development",
  PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000,
  SERVER_PATH: process.env.SERVER_PATH ?? "",
} as const;
export default env;
