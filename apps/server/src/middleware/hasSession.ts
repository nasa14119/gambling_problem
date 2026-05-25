import type { RequestHandler } from "express";

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
