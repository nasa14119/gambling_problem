import { GameState } from "@repo/types";
import {
  GameEventManager,
  GameEventPayloads,
  GameEvents,
} from "../Events/GameEventManager.ts";
import type { Player, PlayerData, SavedGame, TurnSave } from "../types.ts";

type TurnSystemOptions = {
  blind?: number;
};
const DEFAULTS = {
  blind: -Infinity,
};
type TurnSystemLoad = Omit<
  NonNullable<TurnSave>,
  "waiting_queue" | "turn_queue"
> & { waiting_queue: Player[]; turn_queue: Player[] };
export class TurnSystem {
  private _moneyPot: number | null = null;
  public isIdle = true;
  private manager: GameEventManager;
  private turn_queue: Player[] = [];
  private waiting_queue: Player[] = [];
  private _players_pots: Record<string, number> = {};
  private _playerPlaing: Player | null = null;
  private turn_pots: Record<string, number> = {};
  blind = -Infinity;
  private min: number;
  private changeTurn;
  constructor(manager: GameEventManager, options?: TurnSystemOptions) {
    const { blind } = { ...options, ...DEFAULTS };
    this.manager = manager;
    this.changeTurn = this.manager.createEmiter("player:turn");
    this.manager.on({
      eventId: "round:end",
      listener: () => (this._moneyPot = null),
    });
    this.blind = blind;
    this.min = blind;
  }
  get playerPlaing() {
    return this._playerPlaing?.playerId ?? null;
  }
  get players_pots() {
    return this._players_pots;
  }
  get moneyPot() {
    return this._moneyPot;
  }
  // This fuction will wait to a specific event and kill the event in the process
  private waitForEvent<T extends GameEvents>(event: T) {
    return new Promise<GameEventPayloads[T]>((res) =>
      this.manager.on({ eventId: event, listener: res }, true),
    );
  }
  getTurn(): GameState["turn"] {
    if (this._playerPlaing === null) return null;
    return {
      currentPlayer: this.playerPlaing!,
      minBet: this.min,
      playersPots: this._players_pots,
    };
  }
  getSave(): SavedGame["turn"] {
    if (this.isIdle) return null;
    const turn_queue: PlayerData[] = this.playerPlaing
      ? [
          this._playerPlaing!.getData(),
          ...(this.turn_queue.map((p) => p.getData()) ?? []),
        ]
      : this.turn_queue.map((p) => p.getData());
    return {
      moneyPot: this._moneyPot,
      currentPlayer: this.playerPlaing,
      minBet: this.min,
      blind: this.blind,
      playersPots: this._players_pots,
      waiting_queue: this.waiting_queue.map((p) => p.getData()),
      turn_queue,
      turn_pots: this.turn_pots,
    };
  }
  async loadTurn(turn: TurnSystemLoad) {
    this._moneyPot = turn.moneyPot;
    this.min = turn.minBet;
    this._players_pots = turn.playersPots;
    this.waiting_queue = turn.waiting_queue;
    this.turn_queue = turn.turn_queue;
    this.isIdle = false;
    this.turn_pots = turn.turn_pots;
  }
  async resumeTurn() {
    return await this.roundLoop();
  }
  private async roundLoop() {
    let canCheck = true;
    while (this.turn_queue.length > 0) {
      const [current, ...rest] = this.turn_queue;
      if (rest.length <= 0 && this.waiting_queue.length <= 0) {
        this.turn_queue = [];
        break;
      }
      this._playerPlaing = current;
      // This function make the current player retry to play
      const retry = () => (this.turn_queue = [current, ...rest]);
      // Pop front
      this.turn_queue = rest;

      // Emit turn have changed to the player that was on front
      this.changeTurn(current.playerId);
      this._playerPlaing = current;
      let { type, chips } = await this.waitForEvent("player:validbet");
      if (type === "check" && canCheck) {
        this.waiting_queue = [current, ...this.waiting_queue];
        continue;
      }
      if (type === "check") {
        retry();
        this.manager.emit("player:invalid_input", {
          error: "Can't check if players have raise",
          player: current,
        });
        continue;
      }
      if (type === "fold") {
        current.isFold = true;
        continue;
      }
      // From here the player whats to continue in the game
      // Gets the current player money pot added if empty start with 0
      const playerMoney = this.turn_pots[current.playerId] ?? 0;
      // Money in this turn
      const playerMoneyInTurn = playerMoney + chips;
      this.turn_pots[current.playerId] = playerMoneyInTurn;

      // Add the inputted chips to player money pot
      this._players_pots[current.playerId] = playerMoney + chips;
      if (playerMoneyInTurn < this.min) {
        // Emits error for player wrong input (This shoulde'nt happen at this point it should be catched in a earlier stage)
        this.manager.emit("player:insuficientfunds", {
          min: this.min - this._players_pots[current.playerId],
          player: current,
        });
        retry();
        continue;
      }
      if (type === "pay" && playerMoneyInTurn > this.min) {
        type = "raise";
      }
      // We know that the players current pot is greater on equal to min
      if (type === "pay" && playerMoneyInTurn === this.min) {
        // This is the success path when pay
        this.waiting_queue = [...this.waiting_queue, current];
        continue;
      }
      if (type === "pay") {
        this.manager.emit("player:insuficientfunds", {
          min: this.min - playerMoneyInTurn,
          player: current,
        });
        retry();
        continue;
      }
      // Only raise if really new min
      if (type === "raise" && this._players_pots[current.playerId] > this.min) {
        canCheck = false;
        this.turn_queue.push(...this.waiting_queue);
        this.waiting_queue = [current];
        this.min = this._players_pots[current.playerId];
        continue;
      }
      // This case shoulde'nt be accessible
      // Thinking of adding a roolback system for invalid inputs
      retry();
      this.manager.emit("player:insuficientfunds", {
        min: this.min,
        player: current,
      });
    }
    this.isIdle = true;
    // Getting the total pot made in turn
    const turnPot = Object.values(this.turn_pots).reduce(
      (prev, crr) => prev + crr,
      0,
    );

    // Adding turn pot to the global pot
    this._moneyPot = (this._moneyPot ?? 0) + turnPot;

    // Emiting the end of the turn
    this.manager.emit("turn:end", { moneyPot: turnPot });
    this._playerPlaing = null;
  }
  async startTurn(turns: Player[]) {
    this.isIdle = false;
    this.turn_queue = turns;
    this.min = this.blind;
    this.waiting_queue = [];
    this.turn_pots = {};
    this._players_pots = {};
    this.manager.emit("turn:start", undefined);
    await this.roundLoop();
    return;
  }
}
