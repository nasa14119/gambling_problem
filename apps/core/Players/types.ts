import { PlayerHand } from "@repo/types";
import { type Bank } from "./Bank";
import { GameEventManager } from "../Events/GameEventManager";

export const VALID_ACTIONS: ReadonlySet<string> = new Set([
  "fold",
  "raise",
  "pay",
  "check",
]);

export const DEFAULTS = {
  money: 1000,
  chips: 0,
} as const;
export type PlayerOptions = Partial<typeof DEFAULTS>;
export type PlayerData = {
  playerId: string;
  isFold: boolean;
  cards: PlayerHand;
  money: number;
  chips: number;
};
export type PlayerConstructor = {
  playerId: string;
  manager: ReturnType<GameEventManager["createManage"]>;
};
export interface Player {
  playerId: string;
  cards: PlayerHand;
  bank: Bank;
  isFold: boolean;
  turn: () => Promise<void>;
  getData: () => PlayerData;
}
