import { ExploitFacade, GameFacade } from "core/types";
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
    const id = uuid();
    this.sessions.set(prefix + id, game);
    return prefix + id;
  }
  sessionExists(sessionId: string) {
    return this.sessions.has(sessionId);
  }
}
export default Singleton.getInstance();
