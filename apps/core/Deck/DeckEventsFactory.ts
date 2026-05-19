import type { Card } from "@repo/types";
import type { Player } from "../types.ts";
import { Deck } from "./index.ts";
import { GameEventManager } from "../Events/GameEventManager.ts";

export class DeckEventsManager extends Deck {
  manager: ReturnType<GameEventManager["createManage"]>;
  constructor(eventsManager: GameEventManager) {
    super();
    this.manager = eventsManager.createManage();
    this.init();
  }
  startRound(players: Player[]) {
    if (players.length <= 0) return;
    players.forEach((player) => {
      player.cards = this.playerTurn();
    });
    this.manager.emit("deck:cards_deal", undefined);
  }
  private init() {
    this.manager.on({
      eventId: "round:start",
      listener: this.startRound.bind(this),
    });
    this.manager.on({
      eventId: "round:end",
      listener: () => (this.gameState = []),
    });
  }
  flop(): Card[] {
    this.manager.emit("deck:flop", super.flop());
    return this.gameState;
  }
  turn(): Card[] {
    this.manager.emit("deck:turn", super.turn());
    return this.gameState;
  }
  river(): Card[] {
    this.manager.emit("deck:river", super.river());
    return this.gameState;
  }
}
