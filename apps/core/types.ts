import { TurnOptions } from "@repo/types";
import type { Player } from "./Players/types";

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
export { type GameFacade } from "./GameFacade";
export type Transmiter = (eventId: string, payload?: Record<any, any>) => void;
export { Player };
