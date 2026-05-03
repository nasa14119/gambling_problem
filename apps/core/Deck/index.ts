import { getRandomDeck } from "./lib/index.cjs";
import { type Card, getCardName } from "./Card.ts";
import pokersolver, { type Hand } from "./lib/pokersolver.ts";
type PlayerCards = [Card, Card];
export type Player = { playerId: string; cards: PlayerCards };
const pokersolverWinners = pokersolver.Hand.winners;
export class Deck {
  cards: number[];
  position: number;
  gameState: Card[];
  history: Set<Card>;
  private playersHistory: Set<Card>;
  constructor() {
    this.cards = getRandomDeck();
    this.position = 0;
    this.gameState = [];
    this.history = new Set();
    this.playersHistory = new Set();
  }
  private addHistory(card: Card | Card[]) {
    if (Array.isArray(card)) {
      card.forEach((c) => this.addHistory(c));
      return;
    }
    this.history.add(card);
  }
  private addPlayersHistory(card: Card | Card[]) {
    if (Array.isArray(card)) {
      card.forEach((c) => this.addPlayersHistory(c));
      return;
    }
    this.playersHistory.add(card);
  }
  cardWasPlayed(card: Card) {
    return this.history.has(card) || this.playersHistory.has(card);
  }
  resetHistory() {
    this.history = new Set();
  }
  shuffle() {
    this.position = 0;
    this.cards = getRandomDeck();
  }
  private getCards(count: number): Card[] {
    if (count < 1) throw new Error("Count must be greater than 0");
    const cards = this.cards.slice(this.position, this.position + count);
    this.position += count;
    return cards.map<Card>(getCardName);
  }

  playerTurn(): PlayerCards {
    const cards = this.getCards(2) as PlayerCards;
    this.addPlayersHistory(cards);
    return cards;
  }
  flush(): Card[] {
    const cards = this.getCards(3);
    this.addHistory(cards);
    this.gameState.push(...cards);
    return this.gameState;
  }
  turn(): Card[] {
    if (this.gameState.length < 3) throw new Error("Missing flush");
    const [nextCard] = this.getCards(1);
    this.addHistory(nextCard);
    this.gameState.push(nextCard);
    return this.gameState;
  }
  river(): Card[] {
    if (this.gameState.length !== 4)
      throw new Error("Game state must be 4 before river");
    const [nextCard] = this.getCards(1);
    this.addHistory(nextCard);
    this.gameState.push(nextCard);
    return this.gameState;
  }
  getCardsHand(player: Player): Hand {
    const cards = [...player.cards, ...this.gameState];
    const cardsSolved = pokersolver.Hand.solve(cards) as Hand;
    cardsSolved.id = player.playerId;
    return cardsSolved;
  }
  determineWinner(players: Player[]): Array<Player & { for: string }> {
    if (players.length < 2) throw new Error("At least 2 players are required");
    const playersCache: Record<string, Player> = {};
    const playersHands = players.map<Hand>((player) => {
      playersCache[player.playerId] = player;
      return this.getCardsHand(player);
    });
    let winners = pokersolverWinners(playersHands);
    return winners.map((w) => {
      const { id: winnerId, name } = w;
      return { ...playersCache[winnerId], for: name };
    });
  }
}
