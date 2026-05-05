import type { Card, Player } from "@repo/types";
import { Deck } from ".";
import { GameEventManager } from "../Events/GameEventManager";

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
  }
  flop(): Card[] {
    this.manager.emit("game:state_change", this.flop());
    return this.gameState;
  }
  turn(): Card[] {
    this.manager.emit("game:state_change", this.turn());
    return this.gameState;
  }
  river(): Card[] {
    this.manager.emit("game:state_change", this.river());
    return this.gameState;
  }
}
