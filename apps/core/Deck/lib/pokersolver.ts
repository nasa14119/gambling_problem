import { Card } from "../Card";
import pokersolver from "./pokersolver.cjs";
export type Hand = {
  name: string;
  rank: number;
  id: string;
};
type PokerSolver = {
  Hand: { solve(cards: Card[]): Hand; winners: (hands: Hand[]) => Hand[] };
};

export default pokersolver as PokerSolver;
