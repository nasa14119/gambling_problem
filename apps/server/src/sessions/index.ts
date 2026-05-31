import express from "express";
import expressWs from "express-ws";

import sessions from "./Singleton.ts";

export function wsSever(app: express.Application) {
  expressWs(app);
  const appWithWs = app as expressWs.Application;
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
    const { sessionId } = req.cookies;
    const playerId = (req.query.playerId ?? "player:admin") as string;
    if (!sessionId) return ws.close(1003, "No sessionId");
    if (!sessions.sessionExists(sessionId)) {
      console.log("Session not found");
      return ws.close(1003, "Session not found");
    }
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
  appWithWs.ws("/api/game/connect/exploit", (ws, req) => {
    const { playerId = "player:admin", sessionId } = req.cookies;
    if (!sessionId) return ws.close(1003, "No sessionId");
    if (!sessions.sessionExists(sessionId))
      return ws.close(1003, "Session not found");
    try {
      const facade = sessions.connectExploit(sessionId, {
        playerId,
        send: ws.send.bind(ws),
      });
      facade.sendActiveExploits();
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
