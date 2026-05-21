import express from "express";
import { wsSever } from "./index.ts";
import { COOKIES_OPTS } from "./cookieOpts.ts";
const app = wsSever(express());
app.post("/api/game/changePlayer", (req, res) => {
  const { playerId = "guest" } = req.body;
  res.cookie("playerId", playerId, COOKIES_OPTS);
  res.sendStatus(200);
});
app.listen(3000, () => {
  console.log("app listening on port 3000");
});
