import type { Card, PlayerHand, TurnOptions } from "@repo/types";
import type { GameEventPayloads } from "../Events/GameEventManager.ts";
import { Bank } from "./Bank.ts";
import { DEFAULTS, type Player, type PlayerConstructor } from "./types.ts";

type BotDifficulty = "easy" | "medium" | "hard";
type BotConstructor = PlayerConstructor & { difficulty: BotDifficulty };
type BotAction = {
  type: TurnOptions;
  chips: number;
};
type BotTurnContext = {
  canCheck: boolean;
  chipsToCall: number;
};

const MIN_BOT_BET_CHIPS = 50;
const DIFFICULTY_PROFILES: Record<
  BotDifficulty,
  {
    simulations: number;
    randomFoldChance: number;
    callThreshold: number;
    raiseThreshold: number;
    openBetChance: number;
    openBetChips: number;
    raiseChips: number;
  }
> = {
  easy: {
    simulations: 100,
    randomFoldChance: 0.3,
    callThreshold: 0.5,
    raiseThreshold: 0.82,
    openBetChance: 0.15,
    openBetChips: MIN_BOT_BET_CHIPS,
    raiseChips: 100,
  },
  medium: {
    simulations: 1000,
    randomFoldChance: 0.12,
    callThreshold: 0.45,
    raiseThreshold: 0.75,
    openBetChance: 0.35,
    openBetChips: 100,
    raiseChips: 200,
  },
  hard: {
    simulations: 5000,
    randomFoldChance: 0,
    callThreshold: 0.4,
    raiseThreshold: 0.68,
    openBetChance: 0.55,
    openBetChips: 150,
    raiseChips: 300,
  },
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
  private playerBets: Record<string, number> = {};
  private currentBet = 0;

  constructor({ manager, difficulty, playerId }: BotConstructor) {
    this.playerId = playerId;
    this.manager = manager;
    this.difficulty = this.resolveDifficulty(difficulty);
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
        this.resetTurnBets();
      },
    });
    this.manager.on({
      eventId: "turn:start",
      listener: () => this.resetTurnBets(),
    });
    this.manager.on({
      eventId: "player:validbet",
      listener: ({ chips, player, type }) => {
        if (type === "check" || type === "fold" || chips <= 0) return;
        const playerId = player.playerId;
        const playerBet = (this.playerBets[playerId] ?? 0) + chips;
        this.playerBets[playerId] = playerBet;
        this.currentBet = Math.max(this.currentBet, playerBet);
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
    }, 2000);
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

    const winRate = this.runMonteCarloSimulation(
      this.cards,
      this.table,
      this.getSimulationCount(),
    );
    return this.decideAction(winRate, this.getTurnContext());
  }

  private pay(chips: number) {
    if (chips < MIN_BOT_BET_CHIPS || this.bank.chips < MIN_BOT_BET_CHIPS)
      return 0;
    return this.bank.getChips(Math.min(chips, this.bank.chips));
  }

  private getSimulationCount(): number {
    return DIFFICULTY_PROFILES[this.difficulty].simulations;
  }

  private resetTurnBets() {
    this.playerBets = {};
    this.currentBet = 0;
  }

  private getTurnContext(): BotTurnContext {
    const ownBet = this.playerBets[this.playerId] ?? 0;
    const chipsToCall = Math.max(0, this.currentBet - ownBet);
    return {
      canCheck: chipsToCall === 0,
      chipsToCall,
    };
  }

  private resolveDifficulty(difficulty: BotDifficulty): BotDifficulty {
    if (difficulty !== "easy") return difficulty;
    const botNumber = Number(this.playerId.match(/\d+$/)?.[0] ?? 1);
    if (botNumber >= 3) return "hard";
    if (botNumber === 2) return "medium";
    return "easy";
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

  private decideAction(
    winRate: number,
    { canCheck, chipsToCall }: BotTurnContext,
  ): BotAction {
    const profile = DIFFICULTY_PROFILES[this.difficulty];
    const canOpenBet = canCheck && this.bank.chips >= MIN_BOT_BET_CHIPS;

    if (canCheck) {
      if (canOpenBet && winRate >= profile.raiseThreshold) {
        return { type: "raise", chips: profile.openBetChips };
      }

      if (canOpenBet && Math.random() < profile.openBetChance) {
        return { type: "raise", chips: profile.openBetChips };
      }

      return { type: "check", chips: 0 };
    }

    if (chipsToCall < MIN_BOT_BET_CHIPS || chipsToCall > this.bank.chips) {
      return { type: "fold", chips: 0 };
    }

    if (Math.random() < profile.randomFoldChance) {
      return { type: "fold", chips: 0 };
    }

    if (winRate > profile.raiseThreshold) {
      const chips = Math.min(this.bank.chips, chipsToCall + profile.raiseChips);
      if (chips > chipsToCall && chips >= MIN_BOT_BET_CHIPS) {
        return { type: "raise", chips };
      }
    }

    if (winRate > profile.callThreshold) {
      return { type: "pay", chips: chipsToCall };
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
