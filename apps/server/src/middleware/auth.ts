import type { UserAuth } from "db";
import type { RequestHandler } from "express";

import { verifyJWT } from "../lib/jwt.ts";

export const getUserFromToken: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.locals.user = null;
    res.locals.playerId = "player:guest";
    next();
    return;
  }
  try {
    const user = verifyJWT<UserAuth>(token);
    res.locals.user = user;
    res.locals.playerId = user.username;
    next();
  } catch {
    res.sendStatus(401);
  }
};
