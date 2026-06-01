import { ExploitFacade, GameFacade } from "core/types";
import { setRunSession, terminateSession } from "db";
import { v4 as uuid } from "uuid";

import { type Game } from "./interfaceGame.ts";

class Singleton {
  private static instance: Singleton;
  private sessions: Map<string, Game> = new Map();
  private constructor() {}
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
  connectExploit(
    sessionId: string,
    { playerId, send }: { playerId: string; send: (payload: string) => void },
  ): ExploitFacade {
    if (!this.sessions.has(sessionId)) throw new Error("Session Id not found");
    const game = this.sessions.get(sessionId)!;
    return game.attachExploit(playerId, send);
  }
  connectGame(
    sessionId: string,
    { playerId, send }: { playerId: string; send: (payload: string) => void },
  ): GameFacade {
    if (!this.sessions.has(sessionId)) throw new Error("Session Id not found");
    const game = this.sessions.get(sessionId)!;
    return game.attachClient(playerId, send);
  }
  getGameStatus(sessionId: string, playerId: string) {
    if (!this.sessionExists(sessionId)) throw new Error("Session Id not found");
    const game = this.sessions.get(sessionId)!;
    return game.getState(playerId);
  }
  getUserBank(sessionId: string, playerId: string) {
    if (!this.sessionExists(sessionId)) throw new Error("Session Id not found");
    const game = this.sessions.get(sessionId)!;
    return game.getUserBank(playerId);
  }
  getUserStore(sessionId: string, playerId: string) {
    if (!this.sessionExists(sessionId)) throw new Error("Session Id not found");
    const game = this.sessions.get(sessionId)!;
    return game.getUserStore(playerId);
  }
  newGame(game: Game, prefix = "") {
    const id = prefix + uuid();
    if (prefix === "user:") {
      setRunSession(Number(game.id), id);
    }
    this.sessions.set(id, game);
    return id;
  }
  sessionExists(sessionId: string) {
    return this.sessions.has(sessionId);
  }
  teminateDemo(id: string) {
    this.sessions.delete(id);
  }
  terminateGame(sessionId: string, playerId: string) {
    const game = this.sessions.get(sessionId);
    if (!game) return;
    game.kill(playerId);
    terminateSession(sessionId);
  }
}
export default Singleton.getInstance();
