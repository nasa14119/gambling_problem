import { ExploitId, PlayerHand } from "@repo/types";
import { GameEventManager } from "../Events/GameEventManager.ts";
import { Inventory } from "./Inventory.ts";
import { SavedGame } from "@repo/types/server";
import { Rank } from "./Rank.ts";

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

export const DEFAUTS_BOTS = {
  chips: DEFAULTS.money + DEFAULTS.chips,
  minMoney: 300,
} as const;
export type PlayerOptions = Partial<typeof DEFAULTS> & {
  stored?: {
    user: SavedGame["user"];
    mafia: SavedGame["mafia"];
    invetory: SavedGame["invetory"];
  };
};
export type PlayerConstructor = {
  playerId: string;
  manager: ReturnType<GameEventManager["createManage"]>;
};

export type PlayerConstrutorWithUserVals = {
  invetory: Inventory;
} & PlayerConstructor;
