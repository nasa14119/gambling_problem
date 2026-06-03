import { TypeEnd } from "./db.ts";

export * from "core/types";
export type BankData = {
  money: number;
  chips: number;
  next_rank: number;
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
