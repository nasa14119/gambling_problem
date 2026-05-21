import { GameSinglePlayer } from "core";
import { Router } from "express";
import z from "zod";

import { COOKIES_OPTS } from "./cookieOpts.ts";
import sessions from "./Singleton.ts";
const router = Router();

router.post("/api/game/new/singlePlayer", (req, res) => {
  const game = new GameSinglePlayer();
  const { playerId, token } = z
    .object({
      playerId: z.string().optional().default("player:admin"),
      token: z.string().optional().nullable().default(null),
    })
    .optional()
    .default({})
    .parse(req.body);
  game.addPlayer("player:1");
  game.addPlayer("player:2");
  game.addPlayer("player:3");
  game.addPlayer("player:4");
  game.addPlayer(playerId);
  game.init();
  if (!token) {
    res.cookie("sessionId", sessions.newGame(game, "guest:"));
    res.cookie("playerId", playerId, COOKIES_OPTS);
    res.sendStatus(200);
    return;
  }
});
router.post("/api/game/new/prototype", (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId && sessions.sessionExists(sessionId)) {
    res.sendStatus(204);
    return;
  } else {
    res.clearCookie("sessionId");
  }
  const game = new GameSinglePlayer();
  const { data, error, success } = z
    .object({
      players: z.array(z.string()),
    })
    .safeParse(req.body);
  if (!success) return res.status(400).send(error.errors);
  for (const player of data.players) {
    game.addPlayer(player);
  }
  game.init();
  res.cookie("sessionId", sessions.newGame(game), COOKIES_OPTS);
  res.cookie("playerId", "player:admin", COOKIES_OPTS);
  res.sendStatus(200);
});

router.get("/api/game/status", (req, res) => {
  const { playerId, sessionId } = req.cookies;
  if (!sessionId) {
    res.sendStatus(204);
    return;
  }
  if (!sessions.sessionExists(sessionId)) {
    res.clearCookie("sessionId");
    res.sendStatus(204);
    return;
  }
  res.send(sessions.getGameStatus(sessionId, playerId));
});
export default router;
