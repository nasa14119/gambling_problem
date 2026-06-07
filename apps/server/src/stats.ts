import {
  getBestRunningRuns,
  getBestRuns,
  getBestRunUser,
  getMostUsedExploits,
  getPlayersBestRuns,
  UserAuth,
} from "db";
import { Router } from "express";

import { getUserFromToken } from "./middleware/auth.ts";

const app = Router();
app.get("/exploits-used", async (req, res) => {
  const exploits = await getMostUsedExploits();
  if (!exploits) return res.status(204);
  res.json(exploits);
});

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
  if (!exploits) return res.status(204);
  res.json(exploits);
});
export default app;
