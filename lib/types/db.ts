export type NewDebt = {
  credit: number;
  rounds: number;
} | null;

export type ExploitData = {
  exploitId: string;
  name: string;
  price: number;
  type: string;
  description: string;
};
