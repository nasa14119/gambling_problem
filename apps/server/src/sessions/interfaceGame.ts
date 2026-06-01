import type { GameState } from "@repo/types";
import type { BankData } from "@repo/types/server";

import { TypeEnd } from "@repo/types/db";
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
  getUserBank: (id: string) => BankData;
  getUserStore: (playerId: string) => string[];
  id: string;
  init(): void;
  isEnded: null | TypeEnd;
  kill: (id: string) => void;
  terminate: (() => void) | null;
}
