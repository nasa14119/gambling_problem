import { AuthError, loginUser, UserAuth, UserExists } from "db";
import { Router } from "express";

import { signJWT, verifyJWT } from "./lib/jwt.ts";
import { COOKIES_OPTS } from "./sessions/cookieOpts.ts";
const router = Router();

router.post("/login", async (req, res) => {
  try {
    const data = await loginUser(req.body);
    const token = signJWT(data);
    if (!token) {
      throw new Error("Could not sign data");
    }
    res.cookie("token", token, COOKIES_OPTS);
    res.send({ playerId: data.username });
  } catch (e) {
    if (e instanceof AuthError) {
      if (e.code === 500) {
        console.error(e);
        res.status(500).send(e.user);
      }
      res.status(400).send(e.user);
      return;
    }
    throw e;
  }
});

router.get("/logout", (_, res) => {
  res.clearCookie("token");
  res.clearCookie("sessionId");
  res.clearCookie("playerId");
  res.sendStatus(204);
});

router.get("/validate", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    res.sendStatus(401);
    return;
  }
  try {
    const data = verifyJWT<UserAuth>(token);
    const isInDb = await UserExists(data.userUUID);
    if (!isInDb) {
      console.log("User not found");
      res.clearCookie("token");
      res.sendStatus(401);
      return;
    }
    return res.sendStatus(204);
  } catch {
    res.clearCookie("token");
    res.sendStatus(401);
  }
});
export default router;
