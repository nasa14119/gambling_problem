import type { TurnOptions } from "@repo/types";
import type { Player, PlayerData } from "./Players/types.ts";
import { GameEventPayloads, GameEvents } from "@repo/types/server";
import { ExploitId } from "./Exploits/ExploitsTypes.ts";
import {
  ExploitsEvents,
  ExploitsPayloads,
} from "./Events/ExploitsEventManager.ts";
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

export type { Player, PlayerData, ExploitId };

export type {
  GameEventPayloads,
  GameEventManagerType,
  GameEvents,
} from "./Events/GameEventManager.ts";

export type GameEventValue<T extends GameEvents> = {
  eventId: T;
  payload: GameEventPayloads[T];
};

export type ExploitEventValue<T extends ExploitsEvents> = {
  eventId: T;
  payload: ExploitsPayloads[T];
};
export type ExploitEventPayload = {
  [K in ExploitsEvents]: ExploitEventValue<K>;
}[ExploitsEvents];
export type GameEvent = {
  [K in GameEvents]: GameEventValue<K>;
}[GameEvents];

export type ExploitBuyPayload = {
  exploitId: ExploitId;
  playerId: Player["playerId"];
  price: number;
};

export type ExploitTriggerPayload = {
  exploitId: ExploitId;
  playerId: Player["playerId"];
};

export type { ExploitFacade } from "./exploits/ExploitFacade.ts";
export type { Player as User } from "./Players/Player.ts";
