import { CookieOptions } from "express";
const MILISECONDS = 1000,
  MINUTES = 60,
  HOURS = 60,
  DAYS = 1;
export const COOKIES_OPTS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: MILISECONDS * MINUTES * HOURS * DAYS,
};
