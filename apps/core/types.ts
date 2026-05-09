import type { Player } from "./Players/types";

export type ExploitId = "todo" | "example";

export class ErrorInTurn extends Error {
  public readonly type;
  constructor(msg: string, type: "INVALID_INPUT" | "TIME_EXEDED") {
    super(msg);
    this.type = type;
  }
}
export { Player };
