import { PlayerHand } from "@repo/types";
import { BankInterface } from "./Bank.ts";
import { GameEventManager } from "../Events/GameEventManager.ts";
import { Inventory } from "./Inventory.ts";

export const VALID_ACTIONS: ReadonlySet<string> = new Set([
  "fold",
  "raise",
  "pay",
  "check",
]);

export const DEFAULTS = {
  money: 1000,
  chips: 1000,
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
export type PlayerConstrutorWithInvetory = {
  invetory: Inventory;
} & PlayerConstructor;
export interface Player {
  playerId: string;
  cards: PlayerHand;
  bank: BankInterface;
  isFold: boolean;
  turn: () => Promise<void>;
  getData: () => PlayerData;
}
