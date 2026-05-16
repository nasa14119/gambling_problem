import { GameEventManager } from "../Events/GameEventManager";
import { Bank } from "./Bank";
import { Player, PlayerData, type PlayerConstructor } from "./types";
import { TurnOptions } from "@repo/types";

type Card = {
  suit: string;
  value: string;
};

type BotDifficulty = "easy" | "medium" | "hard";
type BotConstructor = PlayerConstructor & {difficulty: BotDifficulty}
const CARD_VALUES: Record<string, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

export class PokerBot implements Player{
  difficulty: BotDifficulty;
    playerId: string;
    manager: BotConstructor["manager"]
    table: Card[] = []
    bank = new Bank(0, 1000);
    cards: Player["cards"]= null
    isFold=false;

  constructor({manager, difficulty, playerId}:BotConstructor
  ) {
    this.playerId = playerId
    this.manager = manager
    this.difficulty = difficulty;
    this.manager.on({eventId: "deck:flop", listener: (payload) => this.table = payload})
  }
  turn: Player["turn"] = async () => {

  }
  getData:Player["getData"] = () => {
    return {
        playerId: this.playerId, 
        cards: this.cards, 
        isFold: this.isFold
    }
  };
  async botTurn(
    communityCards: Card[],
    pot: number
  ) {
    if (!this.cards) return;

    const simulations =
      this.getSimulationCount();

    const winRate =
      this.runMonteCarloSimulation(
        this.cards,
        communityCards,
        simulations
      );

    console.log(
      `[BOT ${this.playerId}] WinRate: ${
        (winRate * 100).toFixed(2)
      }%`
    );

    const action =
      this.decideAction(winRate, pot);

    this.manager.emit("player:input", {
      player: this,
      type: action.type,
      chips: action.chips,
    });
  }

  private getSimulationCount(): number {
    switch (this.difficulty) {
      case "easy":
        return 100;

      case "medium":
        return 1000;

      case "hard":
        return 5000;

      default:
        return 1000;
    }
  }

  private runMonteCarloSimulation(
    hand: Card[],
    communityCards: Card[],
    simulations: number
  ): number {
    let wins = 0;

    for (let i = 0; i < simulations; i++) {
      const result =
        this.simulateGame(
          hand,
          communityCards
        );

      if (result) wins++;
    }

    return wins / simulations;
  }

  private simulateGame(
    hand: Card[],
    communityCards: Card[]
  ): boolean {
    const deck = this.generateDeck();

    const usedCards = [
      ...hand,
      ...communityCards,
    ];

    const filteredDeck = deck.filter(
      (card) =>
        !usedCards.some(
          (used) =>
            used.suit === card.suit &&
            used.value === card.value
        )
    );

    this.shuffle(filteredDeck);

    const opponentHand = [
      filteredDeck.pop()!,
      filteredDeck.pop()!,
    ];

    const board = [...communityCards];

    while (board.length < 5) {
      board.push(filteredDeck.pop()!);
    }

    const playerScore =
      this.evaluateHand([
        ...hand,
        ...board,
      ]);

    const opponentScore =
      this.evaluateHand([
        ...opponentHand,
        ...board,
      ]);

    return playerScore >= opponentScore;
  }

  /**
   * Evaluación simple
   */
  private evaluateHand(
    cards: Card[]
  ): number {
    let total = 0;

    for (const card of cards) {
      total += CARD_VALUES[card.value];
    }

    return total;
  }

  private decideAction(
    winRate: number,
    pot: number
  ): {
    type: TurnOptions;
    chips: number;
  } {

    // EASY comete errores
    if (this.difficulty === "easy") {
      if (Math.random() < 0.3) {
        return {
          type: "fold",
          chips: 0,
        };
      }
    }

    // Mano fuerte
    if (winRate > 0.75) {

      // getChips() ya valida
      const raiseAmount = Math.min(
        200,
        this.bank.chips
      );

      return {
        type: "raise",
        chips: raiseAmount,
      };
    }

    // Mano jugable
    if (winRate > 0.45) {

      const callAmount = Math.min(
        50,
        this.bank.chips
      );

      return {
        type: "pay",
        chips: callAmount,
      };
    }

    // Mano mala
    return {
      type: "fold",
      chips: 0,
    };
  }

  private generateDeck(): Card[] {
    const suits = [
      "hearts",
      "diamonds",
      "clubs",
      "spades",
    ];

    const values = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];

    const deck: Card[] = [];

    for (const suit of suits) {
      for (const value of values) {
        deck.push({
          suit,
          value,
        });
      }
    }

    return deck;
  }

  private shuffle(array: Card[]) {
    for (
      let i = array.length - 1;
      i > 0;
      i--
    ) {
      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [array[i], array[j]] = [
        array[j],
        array[i],
      ];
    }
  }
}