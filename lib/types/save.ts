import type { BackBettting, GameOptions } from "./server.ts";
import type { Card, ExploitId, PlayerHand } from "./app.ts";

export type SiglePlayerOptions = GameOptions & {
  savedGame?: SavedGame;
};

export interface BankInterface {
  getChipsValue(): number;
  getMoneyValue(): number;
  canPay(amount: number): boolean;
  addChips(amout: number): void;
}

export type PlayerData = {
  playerId: string;
  isFold: boolean;
  cards: PlayerHand;
  money: number;
  chips: number;
};

export interface Player {
  playerId: string;
  cards: PlayerHand;
  bank: BankInterface;
  isFold: boolean;
  turn: () => Promise<void>;
  getData: () => PlayerData;
}

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
