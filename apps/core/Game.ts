import { v4 as uuid } from "uuid";
import { GameEventManager, GameEvents } from "./Events/GameEventManager.ts";
import { DeckEventsManager } from "./Deck/DeckEventsFactory.ts";
import { Player } from "./Players/Player.ts";
import { Players } from "./Players/index.ts";
import { TurnSystem } from "./Deck/TurnSystem.ts";
import { GameFacade } from "./GameFacade.ts";
export class Game {
  id: string;
  eventManager = new GameEventManager();
  deck = new DeckEventsManager(this.eventManager);
  players = new Players();
  turnSystem = new TurnSystem(this.eventManager);
  constructor() {
    this.id = uuid();
  }
  init() {
    this.eventManager.on({
      eventId: "player:turn",
      listener: (id) => this.players.playerTurn(id),
    });
    this.eventManager.on({
      eventId: "round:end",
      listener: this.players.resetForNewRound.bind(this.players),
    });
  }
  private waitForEvent<T extends GameEvents>(event: T) {
    return new Promise<void>((res) =>
      this.eventManager.on({ eventId: event, listener: () => res() }, true),
    );
  }
  attachClient(
    player: Player["playerId"],
    send: (payload: string) => void,
  ): GameFacade {
    const facade = new GameFacade({ gameParam: this, player, send });
    return facade;
  }
  determineWinner({ moneyPot }: { moneyPot: number }) {
    if (moneyPot <= 0) return;
    const players = this.players.getPlaingPlayers();
    const sendwinners = this.eventManager.createEmiter("round:winners");
    if (players.length === 0) return;
    if (players.length < 2) {
      players[0].bank.addChips(moneyPot);
      sendwinners({
        gameState: this.deck.gameState,
        moneyWin: moneyPot,
        winners: [{ for: "default", player: players[0] }],
      });
      return;
    }
    const winners = this.deck.determineWinner(players);
    if (winners.length < 2) {
      this.players.getPlayer(winners[0].playerId).bank.addChips(moneyPot);
    } else {
      moneyPot /= winners.length;
      winners.forEach((w) =>
        this.players.getPlayer(w.playerId).bank.addChips(moneyPot),
      );
    }
    sendwinners({
      gameState: this.deck.gameState,
      moneyWin: moneyPot,
      winners: winners.map((w) => ({
        for: w.for,
        player: this.players.getPlayer(w.playerId),
      })),
    });
  }
  roundEnd() {
    this.determineWinner({ moneyPot: this.turnSystem.moneyPot });
    this.eventManager.emit("round:end", undefined);
  }
  canPlay() {
    return this.players.getPlaingPlayers().length > 1;
  }
  async startRound() {
    this.eventManager.emit("round:start", this.players.session());
    this.waitForEvent("deck:cards_deal");
    await this.turnSystem.startTurn(this.players.session());
    if (!this.canPlay()) {
      this.roundEnd();
      return;
    }
    this.deck.flop();
    await this.turnSystem.startTurn(this.players.getPlaingPlayers());
    if (!this.canPlay()) {
      this.roundEnd();
      return;
    }
    this.deck.turn();
    await this.turnSystem.startTurn(this.players.getPlaingPlayers());
    if (!this.canPlay()) {
      this.roundEnd();
      return;
    }
    this.deck.river();
    await this.turnSystem.startTurn(this.players.getPlaingPlayers());
    this.roundEnd();
  }
  addPlayer(id: string) {
    const player = new Player({
      manager: this.eventManager.createManage(),
      playerId: id,
    });
    this.players.attachPlayer(player);
  }
}
