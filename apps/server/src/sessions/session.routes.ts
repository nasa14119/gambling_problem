import type { UserAuth } from "db";

import { GameSinglePlayer } from "core";
import { SavedGame } from "core/types";
import {
  clearSession,
  getCurrentRun,
  getRandomFromUnlock,
  startNewRun,
  updateSessionStart,
} from "db";
import { Router } from "express";
import z from "zod";

import { getUserFromToken } from "../middleware/auth.ts";
import { isDemo } from "../middleware/demo.ts";
import { clearPrevSession, hasSession } from "../middleware/hasSession.ts";
import { COOKIES_OPTS } from "./cookieOpts.ts";
import sessions from "./Singleton.ts";

const router = Router();

router.get(
  "/game/new/singlePlayer",
  getUserFromToken,
  isDemo,
  clearPrevSession,
  async (req, res) => {
    if (sessions.sessionExists(req.cookies.sessionId)) {
      sessions.terminateGame(req.cookies.sessionId, res.locals.playerId);
    }
    const { userUUID } = res.locals.user as UserAuth;
    const runId = await startNewRun(userUUID);
    const exploit = (await getRandomFromUnlock({ userUUID })) ?? undefined;
    const exploits_whitelist = exploit ? [exploit] : [];
    const game = new GameSinglePlayer({ exploits_whitelist, runId });
    const playerId = res.locals.playerId;
    game.addBot();
    game.addBot();
    game.addBot();
    game.addBot();
    game.addPlayer(playerId);
    game.init();
    res.cookie("sessionId", sessions.newGame(game, "user:"));
    res.cookie("playerId", playerId, COOKIES_OPTS);
    res.sendStatus(200);
  },
);

router.get("/game/load", getUserFromToken, async (req, res) => {
  if (!res.locals.user) {
    res.sendStatus(401);
    return;
  }
  const { sessionId } = req.cookies;
  if (sessionId && sessions.sessionExists(sessionId)) {
    res.send(sessions.getGameStatus(sessionId, res.locals.playerId));
    return;
  }
  const last_run = await getCurrentRun(res.locals.user.userUUID);
  if (last_run === null || !last_run.isRunning) {
    res.sendStatus(204);
    return;
  }
  const newSessionId = "user:" + (last_run.sessionId ?? "");
  if (sessions.sessionExists(newSessionId)) {
    res.send(sessions.getGameStatus(newSessionId, last_run.username));
    return;
  } else {
    if (last_run.sessionId) await clearSession(last_run.sessionId);
  }
  if (!last_run.data) {
    throw new Error("No data was stored and session is lost");
  }
  const game = new GameSinglePlayer();
  game.loadGame(last_run.data as SavedGame);
  game.init();
  const gameIdSession = sessions.newGame(game, "user:");
  await updateSessionStart(last_run.runId);
  res.cookie("sessionId", gameIdSession);
  res.cookie("playerId", last_run.username);
  res.send(game.getState(last_run.username));
});
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

router.get(
  "/game/status/store",
  getUserFromToken,
  hasSession,
  async (req, res) => {
    const { sessionId } = req.cookies;
    const playerId = res.locals.playerId;
    if (!playerId) {
      res.sendStatus(400);
      return;
    }
    res.send({ store: await sessions.getUserStore(sessionId, playerId) });
  },
);
router.get("/game/status/bank", getUserFromToken, hasSession, (req, res) => {
  const { sessionId } = req.cookies;
  const playerId = res.locals.playerId;
  if (!playerId) {
    res.sendStatus(400);
    return;
  }
  res.send(sessions.getUserBank(sessionId, playerId));
});
router.get(
  "/game/save-quit",
  hasSession,
  getUserFromToken,
  async (req, res) => {
    if (!res.locals.user) {
      res.sendStatus(401);
      return;
    }
    const { sessionId } = req.cookies;
    await sessions.saveGameQuit(sessionId, res.locals.user as UserAuth);
    res.clearCookie("sessionId");
    res.sendStatus(204);
  },
);
export default router;
