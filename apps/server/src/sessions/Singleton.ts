import type { SessionGameInterface as Game } from "@repo/types/server";
import type { GameSinglePlayer } from "core";

import { ExploitFacade, GameFacade } from "core/types";
import { saveSession, setRunSession, terminateSession, UserAuth } from "db";
import { v4 as uuid } from "uuid";

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
    const game = this.sessions.get(sessionId)! as GameSinglePlayer;
    return game.attachExploit(playerId, send);
  }
  connectGame(
    sessionId: string,
    { playerId, send }: { playerId: string; send: (payload: string) => void },
  ): GameFacade {
    if (!this.sessions.has(sessionId)) throw new Error("Session Id not found");
    const game = this.sessions.get(sessionId)! as GameSinglePlayer;
    return game.attachClient(playerId, send);
  }
  getGameStatus(sessionId: string, playerId: string) {
    if (!this.sessionExists(sessionId)) throw new Error("Session Id not found");
    const game = this.sessions.get(sessionId)!;
    if (game.isEnded !== null) {
      this.sessions.delete(sessionId);
      return null;
    }
    return game.getState(playerId);
  }
  getUserBank(sessionId: string, playerId: string) {
    if (!this.sessionExists(sessionId)) throw new Error("Session Id not found");
    const game = this.sessions.get(sessionId)! as GameSinglePlayer;
    return game.getUserBank(playerId);
  }
  getUserStore(sessionId: string, playerId: string) {
    if (!this.sessionExists(sessionId)) throw new Error("Session Id not found");
    const game = this.sessions.get(sessionId)! as GameSinglePlayer;
    return game.getUserStore(playerId);
  }
  newGame(game: Game, prefix = "") {
    const id = prefix + uuid();
    game.terminate = () => this.teminateDemo(id);
    if (prefix === "user:") {
      setRunSession(Number(game.id), id);
      game.terminate = () => terminateSession(id);
    }
    this.sessions.set(id, game);
    return id;
  }
  saveGameQuit(sessionId: string, user: UserAuth) {
    if (!this.sessionExists(sessionId))
      throw new Error("Session not found for saving");
    const game = this.sessions.get(sessionId)! as GameSinglePlayer;
    const data = game.quit(user.username);
    saveSession({ data, sessionId: sessionId.replace("user:", "") });
    this.sessions.delete(sessionId);
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
  }
}
export default Singleton.getInstance();
