import { PlayerHand } from "@repo/types";
import { BankInterface } from "./Bank.ts";
import { GameEventManager } from "../Events/GameEventManager.ts";
import { Inventory } from "./Inventory.ts";
import { SavedGame } from "@repo/types/server";

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
export type PlayerOptions = Partial<typeof DEFAULTS> & {
  stored?: {
    user: SavedGame["user"];
    mafia: SavedGame["mafia"];
    invetory: SavedGame["invetory"];
  };
};
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
export type PlayerConstrutorWithUserVals = {
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

export type BackBettting = {
  round: number;
  factor: number;
} | null;
