import {
  GameEventManager,
  GameEventPayloads,
  GameEvents,
} from "../Events/GameEventManager";
import { Player } from "../Players/Player";
export class TurnSystem {
  moneyPot: number = 0;
  manger: GameEventManager;
  turn_queue: Player[] = [];
  waiting_queue: Player[] = [];
  players_pots: Record<string, number> = {};
  changeTurn;
  constructor(manager: GameEventManager) {
    this.manger = manager;
    this.changeTurn = this.manger.createEmiter("player:turn");
  }
  // This fuction will wait to a specific event and kill the event in the process
  private waitForEvent<T extends GameEvents>(event: T) {
    return new Promise<GameEventPayloads[T]>((res) =>
      this.manger.on({ eventId: event, listener: res }, true),
    );
  }
  async startTurn(turns: Player[]) {
    this.turn_queue = turns;
    this.waiting_queue = [];
    let min = -Infinity;
    while (this.turn_queue.length > 0) {
      const [current, ...rest] = this.turn_queue;

      // Pop front
      this.turn_queue = rest;

      // Emit turn have changed to the player that was on front
      this.changeTurn(current.playerId);
      console.log(current.playerId);
      console.log(min);
      const { type, chips } = await this.waitForEvent("player:validbet");
      if (type === "fold") {
        current.isFold = true;
        continue;
      }
      // From here the player whats to continue in the game
      // Gets the current player money pot added if empty start with 0
      const playerMoney = this.players_pots[current.playerId] ?? 0;
      // Add the inputted chips to player money pot
      this.players_pots[current.playerId] = playerMoney + chips;
      if (playerMoney + chips < min) {
        // Emits error for player wrong input (This shoulde'nt happen at this point it should be catched in a earlier stage)
        this.manger.emit("player:insuficientfunds", {
          min: min - this.players_pots[current.playerId],
          player: current,
        });
        continue;
      }
      // We know that the players current pot is greater on equal to min
      if (type === "pay") {
        this.waiting_queue = [current, ...this.waiting_queue];
        continue;
      }
      // Only raise if really new min
      if (type === "raise" && this.players_pots[current.playerId] > min) {
        this.turn_queue.push(...this.waiting_queue);
        this.waiting_queue = [current];
        min = this.players_pots[current.playerId];
        continue;
      }

      // This case shoulde'nt be accessible
      // Thinking of adding a roolback system for invalid inputs
      this.turn_queue = [current, ...rest];
      this.manger.emit("player:insuficientfunds", { min, player: current });
    }
    // Getting the total pot made in turn
    const turnPot = Object.values(this.players_pots).reduce(
      (prev, crr) => prev + crr,
      0,
    );
    // Adding turn pot to the global pot
    this.moneyPot += turnPot;

    // Emiting the end of the turn
    this.manger.emit("turn:end", { moneyPot: this.moneyPot });
  }
}
