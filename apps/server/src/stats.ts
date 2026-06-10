import {
  getBestExploitsUsedPlayerRank,
  getBestRunningRuns,
  getBestRuns,
  getBestRunUser,
  getExploitsUsedRank,
  getLastStat,
  getMostUsedExploits,
  getPlayersBestRuns,
  getUserSummary,
  UserAuth,
} from "db";
import { Router } from "express";

import { getUserFromToken } from "./middleware/auth.ts";

const app = Router();

app.get("/best-runs", getUserFromToken, async (req, res) => {
  const runs = await getBestRuns();
  if (!runs) return res.sendStatus(204);
  const user = res.locals.user as UserAuth;
  const userData = user?.userUUID ? await getBestRunUser(user.userUUID) : null;
  res.json({ runs, user: userData });
});

app.get("/best-players", getUserFromToken, async (req, res) => {
  const runs = await getBestRunningRuns();
  const user = res.locals?.user?.userUUID
    ? await getBestRunUser(res.locals.user.userUUID, true)
    : null;
  if (!runs) return res.sendStatus(204);
  res.json({ runs, user });
});

app.get("/best-unique", getUserFromToken, async (req, res) => {
  const runs = await getPlayersBestRuns();
  const user = res.locals?.user?.userUUID
    ? await getBestRunUser(res.locals.user.userUUID)
    : null;
  if (!runs) return res.sendStatus(204);
  res.json({ runs, user });
});

app.get("/exploits-used", async (req, res) => {
  const exploits = await getMostUsedExploits();
  if (!exploits) return res.sendStatus(204);
  res.json(exploits);
});

app.get("/exploits-rank", async (req, res) => {
  const exploits = await getExploitsUsedRank();
  if (!exploits) return res.sendStatus(204);
  res.json(exploits);
});

app.get("/exploits-player", async (req, res) => {
  const exploits = await getBestExploitsUsedPlayerRank();
  if (!exploits) return res.sendStatus(204);
  res.json(exploits);
});

app.get("/user-summary", getUserFromToken, async (req, res) => {
  const user = res.locals.user as UserAuth;
  if (!user) return res.sendStatus(204);
  const data = await getUserSummary(user.userUUID);
  if (data === null) {
    res.sendStatus(204);
    return;
  }
  return res.json(data);
});

app.get("/user-last-run-summary", getUserFromToken, async (req, res) => {
  const user = res.locals.user as UserAuth;
  if (!user) return res.sendStatus(204);
  const data = await getLastStat(user.userUUID);
  if (data === null) {
    res.sendStatus(204);
    return;
  }
  return res.json(data);
});
export default app;
