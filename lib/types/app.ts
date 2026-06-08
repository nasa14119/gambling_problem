import { EXPLOITS } from "./const.ts";
import { ExploitData } from "./db.ts";
import { BankInterface, PlayerData } from "./save.ts";

export type Result<T, E> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: E };

export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function fail<E>(error: E): Result<never, E> {
  return { success: false, error };
}
export type Suit = "c" | "d" | "h" | "s";
export type Num =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "T"
  | "J"
  | "Q"
  | "K"
  | "A";
export type Card = `${Num}${Suit}`;
export type PlayerHand = [Card, Card] | null;
export interface Player {
  playerId: string;
  cards: PlayerHand;
  bank: BankInterface;
  isFold: boolean;
  getData: () => PlayerData;
  turn: () => void;
}

export type TurnOptions = "fold" | "raise" | "pay" | "check";
export type InvetoryData = { [K in ExploitId]?: ExploitData }[];
export type GameState = {
  isStarted: boolean;
  table: null | (Card | null)[];
  players: Record<string, Omit<PlayerData, "money" | "cards">>;
  user: PlayerData & { invetory: ExploitData[]; currentBet: number | null };
  turn: {
    currentPlayer: string;
    minBet: number;
    playersPots: Record<PlayerData["playerId"], number>;
  } | null;
  pot: number | null;
};

export type WinnersPayload = {
  winners: (PlayerData & { for: string })[];
  gameState: Card[];
  moneyWin: number;
} | null;

export type ExploitId = (typeof EXPLOITS)[keyof typeof EXPLOITS];
