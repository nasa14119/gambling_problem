import type { GameState } from "@repo/types";

import { ExploitFacade, GameFacade } from "core/types";

export interface Game {
  addPlayer: (playerId: string) => void;
  attachClient: (
    playerId: string,
    send: (payload: string) => void,
  ) => GameFacade;
  attachExploit: (
    playerId: string,
    send: (payload: string) => void,
  ) => ExploitFacade;
  getState: (id: string) => GameState;
  getUserStore: (playerId: string) => string[];
  init(): void;
}
