import type { TurnOptions } from "@repo/types";
import type { Player, PlayerData } from "./Players/types.ts";
export type ExploitId = "todo" | "example";

export class ErrorInTurn extends Error {
  public readonly type;
  constructor(msg: string, type: "INVALID_INPUT" | "TIME_EXEDED") {
    super(msg);
    this.type = type;
  }
}
export type UserInput = {
  type: TurnOptions;
  player: Player;
  chips: number;
};
export { type GameFacade } from "./GameFacade.ts";
export type Transmiter = (eventId: string, payload?: Record<any, any>) => void;
export type { Player, PlayerData };
export type {
  GameEventPayloads,
  GameEventManagerType,
  GameEvents,
} from "./Events/GameEventManager.ts";
