import { GameSinglePlayer } from "core";
import express from "express";
import expressWs from "express-ws";
import cookieParser from "cookie-parser";
import sessions from "./Singleton";
import z from "zod";

export function wsSever(app: express.Application) {
  const wss = expressWs(app);
  const appWithWs = app as expressWs.Application;
  appWithWs.use(cookieParser());
  appWithWs.use(express.json());
  // Check helth of server
  appWithWs.ws("/api/ping", (ws) => {
    ws.on("message", (mss, isBinary) => {
      if (isBinary) {
        ws.close(1003, "Binary not supported");
        return;
      }
      console.log(mss.toString("utf8"));
      ws.send("pong");
    });
  });

  appWithWs.post("/api/game/new/singlePlayer", (req, res) => {
    const game = new GameSinglePlayer();
    console.log(req.body);
    const { playerId, token } = z
      .object({
        token: z.string().optional().nullable().default(null),
        playerId: z.string().optional().default("guest"),
      })
      .optional()
      .default({})
      .parse(req.body);
    game.addPlayer("player:1");
    game.addPlayer("player:2");
    game.init();
    if (!token) {
      res.cookie("sessionId", sessions.newGame(game, "guest:"));
      // res.cookie("playerId", playerId);
      res.sendStatus(200);
      return;
    }
  });
  appWithWs.ws("/api/game/connect", (ws, req) => {
    2;
    const { sessionId } = req.cookies;
    const playerId = req.query.playerId ?? "guest";
    if (!sessionId) return ws.close(1003, "No sessionId");
    try {
      const facade = sessions.connectGame(sessionId, {
        playerId,
        send: ws.send.bind(ws),
      });
      ws.on("message", (mess, isBinary) => {
        if (isBinary) return;
        facade.handleInput(mess.toString("utf8"));
      });
      ws.on("error", () => {
        facade.terminate();
      });
    } catch (error) {
      console.error(error);
      ws.close(1003, "Something went wrong connection to game");
    }
  });
  return appWithWs;
}
