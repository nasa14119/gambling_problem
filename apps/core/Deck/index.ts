import { getRandomDeck } from "./lib/index.cjs";
import { getCardHash, getCardName } from "./Card.ts";
import { Player, type Card } from "@repo/types";
import pokersolver, { type Hand } from "./lib/pokersolver.cjs";
type PlayerCards = [Card, Card];
const pokersolverWinners = pokersolver.Hand.winners;
const SHUFFLE_THRESHOLD = 0.7;
export class Deck {
  cards: number[];
  position: number;
  gameState: Card[];
  history: Set<Card>;
  disableShuffle = false;
  protected playersHistory: Set<Card>;
  constructor() {
    this.cards = getRandomDeck();
    this.position = 0;
    this.gameState = [];
    this.history = new Set();
    this.playersHistory = new Set();
  }
  get mustShuffle() {
    return this.position / this.cards.length >= SHUFFLE_THRESHOLD;
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
  getPickNextCard(nextCard: number = 1): Card[] {
    const cards = this.cards.slice(this.position, this.position + nextCard);
    const cardNamed = cards.map<Card>(getCardName);
    return cardNamed;
  }
  resetHistory() {
    this.history = new Set();
  }
  swap(card: Card) {
    const pos = this.position,
      cards = this.cards;
    const cardCode = getCardHash(card);
    const looking = cards.indexOf(cardCode);
    [cards[pos], cards[looking]] = [cards[looking], cards[pos]];
    this.position++;
    return this.position;
  }
  /**
   * Clear table history and player history
   */
  resetForNewRound() {
    this.gameState = [];
    this.history = new Set();
    this.playersHistory = new Set();
  }
  /**
   * @returns Whether the deck was actually shuffled.
   */
  shuffle() {
    const willNoShuffle = this.disableShuffle && !this.mustShuffle;
    if (willNoShuffle) return false;
    this.position = 0;
    this.cards = getRandomDeck();
    this.resetForNewRound();
    return true;
  }

  /**
   * Will actually change the position of the deck
   */
  public getCards(count: number): Card[] {
    if (count < 1) throw new Error("Count must be greater than 0");
    if (this.mustShuffle) {
      this.shuffle();
    }
    const cards = this.cards.slice(this.position, this.position + count);
    this.position += count;
    return cards.map<Card>(getCardName);
  }

  playerTurn(): PlayerCards {
    const cards = this.getCards(2) as PlayerCards;
    this.addPlayersHistory(cards);
    return cards;
  }
  flop(): Card[] {
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
  private getCardsHand(player: Player): Hand {
    if (!player.cards) throw new Error("Player has no cards");
    const cards = [...player.cards, ...this.gameState];
    const cardsSolved = pokersolver.Hand.solve(cards) as Hand;
    cardsSolved.id = player.playerId;
    return cardsSolved;
  }
  remove(cards: Card[]) {
    const codes = cards.map(getCardHash);
    codes.forEach((c) => {
      this.cards = this.cards.filter((v) => v === c);
    });
  }
  determineWinner(
    players: Player[],
  ): Array<{ playerId: Player["playerId"]; for: string }> {
    if (players.length < 2) throw new Error("At least 2 players are required");
    const playersCache: Record<string, Player> = {};
    const playersHands = players.map<Hand>((player) => {
      playersCache[player.playerId] = player;
      return this.getCardsHand(player);
    });
    let winners = pokersolverWinners(playersHands);
    return winners.map((w) => {
      const { id: winnerId, name } = w;
      const player = { ...playersCache[winnerId], for: name };
      return { playerId: player.playerId, for: name };
    });
  }
}
