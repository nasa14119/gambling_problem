import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "../env.ts";
const { JWT_SECRET } = env;

export const signJWT = (payload: Record<string, unknown>) => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  } catch {
    return null;
  }
};

export const verifyJWT = <T extends Record<string, unknown>>(
  token: string,
): T => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload & T;
};
