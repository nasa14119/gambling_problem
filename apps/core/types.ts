import type {
  Card,
  ExploitId,
  GameState,
  InvetoryData,
  TurnOptions,
} from "@repo/types";
import type { BackBettting, Player, PlayerData } from "./Players/types.ts";
import { GameEventPayloads, GameEvents } from "@repo/types/server";
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

export type { Player, PlayerData, ExploitsEvents };

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

export type { ExploitFacade } from "./Exploits/ExploitFacade.ts";
export type { Player as User } from "./Players/Player.ts";

export type GameOptions = {
  runId?: number;
  exploits_whitelist?: ExploitId[];
  savedGame?: SavedGame;
};
export type TurnSave = {
  moneyPot: number | null;
  currentPlayer: string | null;
  minBet: number;
  blind: number;
  playersPots: Record<string, number>;
  waiting_queue: PlayerData[];
  turn_queue: PlayerData[];
  turn_pots: Record<string, number>;
} | null;
export type SavedGame = {
  isStarted: boolean;
  playerId: string;
  runId: string;
  round: number;
  exploits_whitelist: ExploitId[];
  level: number;
  deck: {
    cards: number[];
    position: number;
    gameState: Card[];
    history: Card[];
    playersHistory: Card[];
  };
  players: PlayerData[];
  turn: TurnSave;
  user: {
    chips: number;
    money: number;
    moneySpend: number;
    moneyTotal: number;
    next_rank: number;
    card: Player["cards"];
    isFold: boolean;
  };
  mafia: {
    backbett: BackBettting;
    playerPay: number;
    playerCredit: number;
    havePay: boolean;
  };
  invetory: {
    itmes: ExploitId[];
    active: ExploitId[];
  };
  exploitStore: {
    [key: string]: any;
  };
};
