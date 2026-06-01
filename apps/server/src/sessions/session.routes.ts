import type { UserAuth } from "db";

import { GameSinglePlayer } from "core";
import { startNewRun } from "db";
import { Router } from "express";
import z from "zod";

import { getUserFromToken } from "../middleware/auth.ts";
import { isDemo } from "../middleware/demo.ts";
import { hasSession } from "../middleware/hasSession.ts";
import { COOKIES_OPTS } from "./cookieOpts.ts";
import sessions from "./Singleton.ts";

const router = Router();

router.get(
  "/game/new/singlePlayer",
  getUserFromToken,
  isDemo,
  async (req, res) => {
    if (sessions.sessionExists(req.cookies.sessionId)) {
      sessions.terminateGame(req.cookies.sessionId, res.locals.playerId);
    }
    const { userUUID } = res.locals.user as UserAuth;
    const runId = await startNewRun(userUUID);
    const game = new GameSinglePlayer({ runId });
    const playerId = res.locals.playerId;
    game.addBot("bot:1");
    game.addBot("bot:2");
    game.addBot("bot:3");
    game.addBot("bot:4");
    game.addPlayer(playerId);
    game.init();
    res.cookie("sessionId", sessions.newGame(game, "user:"));
    res.cookie("playerId", playerId, COOKIES_OPTS);
    res.sendStatus(200);
  },
);

router.post("/game/new/prototype", (req, res) => {
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

router.get("/game/status", getUserFromToken, hasSession, (req, res) => {
  const { sessionId } = req.cookies;
  const status = sessions.getGameStatus(sessionId, res.locals.playerId);
  if (!status) {
    res.clearCookie("sessionId");
    res.sendStatus(204);
    return;
  }
  res.send(status);
});

router.get("/game/status/store", getUserFromToken, hasSession, (req, res) => {
  const { sessionId } = req.cookies;
  const playerId = res.locals.playerId;
  if (!playerId) {
    res.sendStatus(400);
    return;
  }
  res.send({ store: sessions.getUserStore(sessionId, playerId) });
});
router.get("/game/status/bank", getUserFromToken, hasSession, (req, res) => {
  const { sessionId } = req.cookies;
  const playerId = res.locals.playerId;
  if (!playerId) {
    res.sendStatus(400);
    return;
  }
  res.send(sessions.getUserBank(sessionId, playerId));
});
export default router;
