import { GameFacade } from "core/types";

export interface Game {
  init(): void;
  addPlayer: (playerId: string) => void;
  attachClient: (
    playerId: string,
    send: (payload: string) => void,
  ) => GameFacade;
}
