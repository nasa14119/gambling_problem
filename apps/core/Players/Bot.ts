import type { Card, PlayerHand, TurnOptions } from "@repo/types";
import type { GameEventPayloads } from "../Events/GameEventManager";
import { Bank } from "./Bank";
import { DEFAULTS, type Player, type PlayerConstructor } from "./types";

type BotDifficulty = "easy" | "medium" | "hard";
type BotConstructor = PlayerConstructor & { difficulty: BotDifficulty };
type BotAction = {
  type: TurnOptions;
  chips: number;
};

const CARD_VALUES: Record<Card[0], number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

const SUITS = ["c", "d", "h", "s"] as const;
const VALUES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
] as const;

export class PokerBot implements Player {
  difficulty: BotDifficulty;
  playerId: string;
  table: Card[] = [];
  bank = new Bank(DEFAULTS.money, DEFAULTS.chips);
  cards: PlayerHand = null;
  isFold = false;
  private manager: BotConstructor["manager"];
  private sendInput: (payload: GameEventPayloads["player:validbet"]) => void;
  private shouldCall = false;
  private missingCallChips = 50;

  constructor({ manager, difficulty, playerId }: BotConstructor) {
    this.playerId = playerId;
    this.manager = manager;
    this.difficulty = difficulty;
    this.sendInput = manager.getEmiter("player:validbet");
    this.manager.on({
      eventId: "deck:flop",
      listener: (payload) => (this.table = payload),
    });
    this.manager.on({
      eventId: "deck:turn",
      listener: (payload) => (this.table = payload),
    });
    this.manager.on({
      eventId: "deck:river",
      listener: (payload) => (this.table = payload),
    });
    this.manager.on({
      eventId: "round:end",
      listener: () => {
        this.table = [];
        this.shouldCall = false;
        this.missingCallChips = 50;
      },
    });
    this.manager.on({
      eventId: "player:invalid_input",
      listener: ({ player }) => {
        if (player.playerId === this.playerId) this.shouldCall = true;
      },
    });
    this.manager.on({
      eventId: "player:insuficientfunds",
      listener: ({ min, player }) => {
        if (player.playerId !== this.playerId) return;
        this.shouldCall = true;
        this.missingCallChips = Math.max(1, min);
      },
    });
  }

  turn: Player["turn"] = async () => {
    const action = this.getAction();
    const chips =
      action.type === "pay" || action.type === "raise"
        ? this.pay(action.chips)
        : 0;

    setTimeout(() => {
      this.sendInput({
        player: this,
        type:
          chips === 0 && (action.type === "pay" || action.type === "raise")
            ? "fold"
            : action.type,
        chips,
      });
    }, 0);
  };

  getData: Player["getData"] = () => {
    return {
      playerId: this.playerId,
      cards: this.cards,
      isFold: this.isFold,
      money: this.bank.money,
      chips: this.bank.chips,
    };
  };

  private getAction(): BotAction {
    if (!this.cards) return { type: "fold", chips: 0 };
    if (!this.shouldCall) return { type: "check", chips: 0 };

    const winRate = this.runMonteCarloSimulation(
      this.cards,
      this.table,
      this.getSimulationCount(),
    );
    const action = this.decideAction(winRate);
    this.shouldCall = false;
    this.missingCallChips = 50;
    return action;
  }

  private pay(chips: number) {
    if (chips <= 0 || this.bank.chips <= 0) return 0;
    return this.bank.getChips(Math.min(chips, this.bank.chips));
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
    hand: NonNullable<PlayerHand>,
    communityCards: Card[],
    simulations: number,
  ): number {
    let wins = 0;

    for (let i = 0; i < simulations; i++) {
      if (this.simulateGame(hand, communityCards)) wins++;
    }

    return wins / simulations;
  }

  private simulateGame(
    hand: NonNullable<PlayerHand>,
    communityCards: Card[],
  ): boolean {
    const usedCards = [...hand, ...communityCards];
    const filteredDeck = this.generateDeck().filter(
      (card) => !usedCards.includes(card),
    );

    this.shuffle(filteredDeck);

    const opponentHand = [
      filteredDeck.pop()!,
      filteredDeck.pop()!,
    ] as NonNullable<PlayerHand>;
    const board = [...communityCards];

    while (board.length < 5) {
      board.push(filteredDeck.pop()!);
    }

    return (
      this.evaluateHand([...hand, ...board]) >=
      this.evaluateHand([...opponentHand, ...board])
    );
  }

  private evaluateHand(cards: Card[]): number {
    return cards.reduce((total, card) => total + CARD_VALUES[card[0]], 0);
  }

  private decideAction(winRate: number): BotAction {
    if (this.missingCallChips > this.bank.chips) {
      return { type: "fold", chips: 0 };
    }

    if (this.difficulty === "easy" && Math.random() < 0.3) {
      return { type: "fold", chips: 0 };
    }

    if (winRate > 0.75 && this.missingCallChips + 200 <= this.bank.chips) {
      return { type: "raise", chips: this.missingCallChips + 200 };
    }

    if (winRate > 0.45) {
      return { type: "pay", chips: this.missingCallChips };
    }

    return { type: "fold", chips: 0 };
  }

  private generateDeck(): Card[] {
    const deck: Card[] = [];

    for (const suit of SUITS) {
      for (const value of VALUES) {
        deck.push(`${value}${suit}`);
      }
    }

    return deck;
  }

  private shuffle(array: Card[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
