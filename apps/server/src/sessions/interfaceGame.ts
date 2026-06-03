import type { GameState } from "@repo/types";
import type { BankData, SavedGame } from "@repo/types/server";

import { ExploitData, TypeEnd } from "@repo/types/db";
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
  getUserStore: (playerId: string) => Promise<ExploitData[]>;
  id: string;
  init(): void;
  isEnded: null | TypeEnd;
  kill: (id: string) => void;
  quit(id: string): SavedGame;
  save(id: string): SavedGame;
  terminate: (() => void) | null;
}
