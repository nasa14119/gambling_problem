import { ExploitId } from "./app.ts";

export type TypeEnd = "WIN" | "BANKRUPT" | "TERMINATED" | "DEATH";
export type NewDebt = {
  credit: number;
  rounds: number;
} | null;

export type ExploitData = {
  exploitId: ExploitId;
  name: string;
  price: number;
  type: string;
  description: string;
};

export type RunDataGame = {
  moneyTotal: number;
  moneySpend: number;
  typeEnd: TypeEnd;
  level: number;
};
