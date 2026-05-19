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
    const { playerId, token } = z
      .object({
        token: z.string().optional().nullable().default(null),
        playerId: z.string().optional().default("player:admin"),
      })
      .optional()
      .default({})
      .parse(req.body);
    game.addPlayer("player:1");
    game.addPlayer("player:2");
    game.addPlayer("player:3");
    game.addPlayer("player:4");
    game.init();
    if (!token) {
      res.cookie("sessionId", sessions.newGame(game, "guest:"));
      res.cookie("playerId", playerId);
      res.sendStatus(200);
      return;
    }
  });
  appWithWs.post("/api/game/new/prototype", (req, res) => {
    const { sessionId } = req.cookies;
    if (sessionId && sessions.sessionExists(sessionId)) {
      res.sendStatus(204);
      return;
    } else {
      res.clearCookie("sessionId");
    }
    const game = new GameSinglePlayer();
    const { success, data, error } = z
      .object({
        players: z.array(z.string()),
      })
      .safeParse(req.body);
    if (!success) return res.status(400).send(error.errors);
    for (const player of data.players) {
      game.addPlayer(player);
    }
    game.init();
    res.cookie("sessionId", sessions.newGame(game));
    res.sendStatus(200);
  });
  appWithWs.ws("/api/game/connect/prototype", (ws, req) => {
    const { sessionId } = req.cookies;
    if (!sessionId || !sessions.sessionExists(sessionId))
      return ws.close(1003, "No sessionId");
    const playerId = req.query.playerId as string | undefined;
    if (!playerId) return ws.close(1003, "No playerId");
    const facade = sessions.connectGame(sessionId, {
      playerId,
      send: ws.send.bind(ws),
    });
    if (facade.player.cards !== null) {
      ws.send(
        JSON.stringify({
          eventId: "deck:cards_deal",
          payload: facade.player.cards,
        }),
      );
      if (facade.game.deck.gameState.length > 0) {
        ws.send(
          JSON.stringify({
            eventId: { 3: "deck:flop", 4: "deck:turn", 5: "deck:river" }[
              facade.game.deck.gameState.length
            ],
            payload: facade.game.deck.gameState,
          }),
        );
      }
    }
    ws.on("message", (mss, isBinary) => {
      if (isBinary) return;
      facade.handleInput(mss.toString("utf8"));
    });
    ws.on("error", (e) => {
      console.error(e);
      facade.terminate();
    });
  });
  appWithWs.ws("/api/game/connect", (ws, req) => {
    2;
    const { sessionId } = req.cookies;
    const playerId = (req.query.playerId ?? "player:admin") as string;
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
