import type { RequestHandler } from "express";

import { GameSinglePlayer } from "core";

import { COOKIES_OPTS } from "../sessions/cookieOpts.ts";
import sessions from "../sessions/Singleton.ts";

export const isDemo: RequestHandler = (req, res, next) => {
  if (res.locals.user) {
    next();
    return;
  }
  if (
    !req.cookies.sessionId ||
    !sessions.sessionExists(req.cookies.sessionId)
  ) {
    const game = new GameSinglePlayer();
    game.addBot("bot:1");
    game.addBot("bot:2");
    game.addBot("bot:3");
    game.addBot("bot:4");
    game.addPlayer("player:guest");
    game.init();
    sessions.newGame(game, "guest:");
    res.cookie("sessionId", sessions.newGame(game, "guest:"), COOKIES_OPTS);
    res.cookie("playerId", "player:guest", COOKIES_OPTS);
    res.send(game.getState("player:guest"));
    return;
  }
  res.sendStatus(204);
};
