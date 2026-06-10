import type { RequestHandler } from "express";

import { terminateGame, UserAuth } from "db";

import session from "../sessions/Singleton.ts";

export const hasSession: RequestHandler = (req, res, next) => {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    res.sendStatus(404);
    return;
  }
  if (!session.sessionExists(sessionId)) {
    res.clearCookie("sessionId");
    res.sendStatus(204);
    return;
  }
  next();
};

export const clearPrevSession: RequestHandler = async (req, res, next) => {
  const { sessionId } = req.cookies;
  if (session.sessionExists(sessionId)) {
    session.terminateGame(sessionId, res.locals.playerId);
    next();
    return;
  }
  const { userUUID } = res.locals.user as UserAuth;
  await terminateGame(userUUID);
  next();
};
