import type { GameState } from "@repo/types";

import { GameFacade } from "core/types";

export interface Game {
  addPlayer: (playerId: string) => void;
  attachClient: (
    playerId: string,
    send: (payload: string) => void,
  ) => GameFacade;
  getState: (id: string) => GameState;
  init(): void;
}
