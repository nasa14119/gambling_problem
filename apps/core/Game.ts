import { v4 as uuid } from "uuid";
import { GameEventManager } from "./Events/GameEventManager.ts";
import { DeckEventsManager } from "./Deck/DeckEventsFactory.ts";
import { Player } from "./Players/Player.ts";
import { Players } from "./Players/index.ts";
import { TurnSystem } from "./Deck/TurnSystem.ts";
import { GameFacade } from "./GameFacade.ts";
import { PokerBot } from "./Players/Bot.ts";
import type { GameState } from "@repo/types";
import { Inventory } from "./Players/Inventory.ts";
import { ExploitManager } from "./Exploits/ExploitManager.ts";
import { ExploitFacade } from "./Exploits/ExploitFacade.ts";
import { User } from "@repo/types/server";

export class Game {
  id: string;
  eventManager = new GameEventManager();
  deck = new DeckEventsManager(this.eventManager);
  players = new Players();
  turnSystem = new TurnSystem(this.eventManager);
  exploitsManager = new ExploitManager(this);
  private isStarted = false;
  constructor() {
    this.id = uuid();
  }
  private getUser(id: string): User {
    const user = this.players.getPlayer(id) as User;
    if (!user || user instanceof PokerBot)
      throw new Error("Error trying to get state");
    return user;
  }
  getState(id: string): GameState {
    const user = this.getUser(id);
    const { [id]: _, ...players } = { ...this.players.getPlayersData() };
    return {
      isStarted: this.isStarted,
      table: this.deck.gameState,
      players,
      user: user.getData(),
      turn: this.turnSystem.getTurn(),
      pot: this.turnSystem.moneyPot,
    };
  }
  init() {
    this.eventManager.on({
      eventId: "player:turn",
      listener: (id: string) => this.players.playerTurn(id),
    });
    this.eventManager.on({
      eventId: "round:end",
      listener: this.players.resetForNewRound.bind(this.players),
    });
  }
  attachClient(
    player: Player["playerId"],
    send: (payload: string) => void,
  ): GameFacade {
    const facade = new GameFacade({ gameParam: this, player, send });
    return facade;
  }
  attachExploit(playerId: string, send: (payload: string) => void) {
    const facade = new ExploitFacade(this.exploitsManager, playerId, send);
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
    this.isStarted = false;
    this.determineWinner({ moneyPot: this.turnSystem.moneyPot ?? 0 });
    this.eventManager.emit("round:end", undefined);
  }
  canPlay() {
    return this.players.getPlaingPlayers().length > 1;
  }
  async startRound() {
    this.isStarted = true;
    this.eventManager.emit("round:start", this.players.session());
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
    const invetory = new Inventory(this.exploitsManager.eventManger, id);
    const player = new Player({
      manager: this.eventManager.createManage(),
      playerId: id,
      invetory,
    });
    this.players.attachPlayer(player);
  }
  addBot(id: string) {
    const bot = new PokerBot({
      difficulty: "easy",
      playerId: id,
      manager: this.eventManager.createManage(),
    });
    this.players.attachPlayer(bot);
  }
}
