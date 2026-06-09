import { Card, ExploitId, Player, PlayerHand, TurnOptions } from "./app.ts";
import { TypeEnd } from "./db.ts";
export * from "./save.ts";
export * from "./events.ts";
// export * from "core/types";
export type BankData = {
  money: number;
  chips: number;
  next_rank: number | null;
  current_rank: number;
  credit: number;
  pay: number;
  round_to_end: number;
};
export interface SessionGameInterface {
  addPlayer: (playerId: string) => void;
  attachClient(playerId: string, send: (payload: string) => void): unknown;
  attachExploit(playerId: string, send: (payload: string) => void): unknown;
  getState(id: string): unknown;
  id: string;
  init(): void;
  isEnded: null | TypeEnd;
  kill: (id: string) => void;
  quit(id: string): unknown;
  terminate: (() => void) | null;
}

export type GameOptions = {
  runId?: number;
  exploits_whitelist?: ExploitId[];
};

export type GameWinnerPayload = {
  moneyWin: number;
  gameState: Card[];
  winners: { player: Player; for: string }[];
};
export type BackBettting = {
  round: number;
  factor: number;
} | null;

export type LastRun = {
  typeEnd: TypeEnd;
  moneyTotal: number;
  moneySpend: number;
  exploitsUsed: number;
  finalScore: number;
} | null;
