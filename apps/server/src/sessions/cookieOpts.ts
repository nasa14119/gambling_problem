import { CookieOptions } from "express";

const DAYS = 1,
  HOURS = 60,
  MILISECONDS = 1000,
  MINUTES = 60;
export const COOKIES_OPTS: CookieOptions = {
  httpOnly: true,
  maxAge: MILISECONDS * MINUTES * HOURS * DAYS,
  sameSite: "lax",
  secure: true,
};
