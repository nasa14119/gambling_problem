import { type Game } from "./interfaceGame";
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
  newGame(game: Game, prefix = "") {
    const id = uuid();
    this.sessions.set(prefix + id, game);
    return prefix + id;
  }
  connectGame(
    sessionId: string,
    { playerId, send }: { playerId: string; send: (payload: string) => void },
  ) {
    if (!this.sessions.has(sessionId)) throw new Error("Session Id not found");
    const game = this.sessions.get(sessionId)!;
    return game.attachClient(playerId, send);
  }
}

export default Singleton.getInstance();
