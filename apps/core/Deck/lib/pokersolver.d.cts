import type { Card } from "@repo/types";

export interface Hand {
  name: string;
  rank: number;
  id: string;
}

export const Hand: {
  solve(cards: Card[], game?: string): Hand;
  winners(hands: Hand[]): Hand[];
};
