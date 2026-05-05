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
    turns.forEach((p) => {
      p.isFold = false;
    });
    this.turn_queue = turns;
    let players: Record<string, number> = {};
    let min = -Infinity;
    while (this.turn_queue.length > 0) {
      const [current, ...rest] = this.turn_queue;
      this.turn_queue = rest;
      this.changeTurn(current.playerId);
      console.log(current.playerId);
      console.log(min);
      const { type, chips } = await this.waitForEvent("player:validbet");
      if (type === "fold") {
        current.isFold = true;
        this.turn_queue = rest;
        continue;
      }
      // Player don't fold
      const playerMoney = players[current.playerId] ?? 0;
      players[current.playerId] = playerMoney + chips;
      if (playerMoney + chips < min) {
        this.manger.emit("player:insuficientfunds", {
          min: min - players[current.playerId],
          player: current,
        });
        continue;
      }
      if (type === "pay") {
        this.waiting_queue = [current, ...this.waiting_queue];
        continue;
      }
      // Only raise if really new min
      if (type === "raise" && players[current.playerId] > min) {
        this.turn_queue.push(...this.waiting_queue);
        this.waiting_queue = [current];
        min = players[current.playerId];
        continue;
      }
      this.turn_queue = [current, ...rest];
      this.manger.emit("player:insuficientfunds", { min, player: current });
    }
    // Adding resulting pot to global
    const turnPot = Object.values(players).reduce((prev, crr) => prev + crr, 0);
    this.moneyPot += turnPot;
    this.manger.emit("turn:end", { moneyPot: this.moneyPot });
  }
}
