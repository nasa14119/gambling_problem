import { getBestRuns, getBestRunUser, getMostUsedExploits, UserAuth } from "db";
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
export default app;
