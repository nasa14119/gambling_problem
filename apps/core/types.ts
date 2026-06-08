export class ErrorInTurn extends Error {
  public readonly type;
  constructor(msg: string, type: "INVALID_INPUT" | "TIME_EXEDED") {
    super(msg);
    this.type = type;
  }
}
export { type GameFacade } from "./GameFacade.ts";
export type Transmiter = (eventId: string, payload?: Record<any, any>) => void;

export type { GameEventManagerType } from "./Events/GameEventManager.ts";
export type { ExploitFacade } from "./Exploits/ExploitFacade.ts";
export type { Player as User } from "./Players/Player.ts";
