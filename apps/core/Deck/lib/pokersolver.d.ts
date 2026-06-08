declare module "pokersolver.js" {
  import { Card } from "@repo/types";
  export interface Hand {
    name: string;
    rank: number;
    id: string;
  }

  interface PokerSolver {
    Hand: {
      solve(cards: Card[], game?: string): Hand;
      winners(hands: Hand[]): Hand[];
    };
  }

  export default pokerSolver as PokerSolver;
}
