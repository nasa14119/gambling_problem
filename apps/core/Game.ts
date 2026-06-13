/* 
  This is the file that contain the base logic for a pocker game 
  The idea is that this could be share between game modes like multiplayer or demo 
 */
import { v4 as uuid } from "uuid";
import { GameEventManager } from "./Events/GameEventManager.ts";
import { DeckEventsManager } from "./Deck/DeckEventsFactory.ts";
import { Player } from "./Players/Player.ts";
import { Players } from "./Players/index.ts";
import { TurnSystem } from "./Deck/TurnSystem.ts";
import type { Card, ExploitId } from "@repo/types";
import { ExploitManager } from "./Exploits/ExploitManager.ts";
import { ExploitFacade } from "./Exploits/ExploitFacade.ts";
import type { TypeEnd } from "@repo/types/db";
import { GameOptions, SessionGameInterface } from "@repo/types/server";
import { User } from "./types.ts";
import { PokerBot } from "./Players/Bots/Bot.ts";

// This class the basic pocker and exploits functionality
export abstract class Game implements SessionGameInterface {
  id: string;
  eventManager = new GameEventManager();
  deck = new DeckEventsManager(this.eventManager);
  players = new Players();
  turnSystem = new TurnSystem(this.eventManager);
  exploitsManager = new ExploitManager(this);
  terminate: null | (() => Promise<void>) = null;
  public exploits_whitelist: ExploitId[] = [];
  protected _isStarted = false;
  public round: number = 0;
  public isEnded: TypeEnd | null = null;
  get isStarted() {
    return this._isStarted;
  }
  constructor({ runId, exploits_whitelist = [] }: GameOptions = {}) {
    this.id = runId?.toString() ?? uuid();
    this.round = 0;
    this.exploits_whitelist = [...exploits_whitelist];
  }

  // Methods needed by session system

  /** Referce  to the gameState in that particular moment*/
  abstract getState(id: string): unknown;

  /** Any necessary elements needed before inicialization like game level event listeneres*/
  abstract init(): void;

  /** Terminate the game (will end game) */
  abstract kill(playerId: string): void;

  /** Save the game without removing*/
  abstract quit(id: string): unknown;

  /** Add a player to the game */
  abstract addPlayer(id: string, options?: unknown): unknown;

  /** Attach a websocket to the game  */
  abstract attachClient(
    player: Player["playerId"],
    send: (payload: string) => void,
  ): unknown;

  /** Attach a websocket to the ExploitManager */
  attachExploit(playerId: string, send: (payload: string) => void) {
    const facade = new ExploitFacade(this.exploitsManager, playerId, send);
    return facade;
  }

  /** This is the method for logic to determine the winner or if tie split the pot */
  determineWinner({ moneyPot, state }: { moneyPot: number; state: Card[] }) {
    if (moneyPot <= 0) return;
    const players = this.players.getPlaingPlayers();
    const sendwinners = this.eventManager.createEmiter("round:winners");
    if (players.length === 0) return;
    if (players.length < 2) {
      players[0].bank.addChips(moneyPot);
      sendwinners({
        gameState: state,
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
      gameState: state,
      moneyWin: moneyPot,
      winners: winners.map((w) => ({
        for: w.for,
        player: this.players.getPlayer(w.playerId),
      })),
    });
  }

  /** This are a helper method for teminating a round */
  roundEnd() {
    this._isStarted = false;
    this.determineWinner({
      moneyPot: this.turnSystem.moneyPot ?? 0,
      state: [...this.deck.gameState],
    });
    this.eventManager.emit("round:end", { round: this.round });
  }
  canPlay() {
    if (this.isEnded) return false;
    return this.players.getPlaingPlayers().length > 1;
  }

  /** Logic for cordinating a round, will be call on round start */
  async startRound() {
    if (this.isEnded) return;
    this._isStarted = true;
    this.round++;
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

  /** This will return a players but as user, adding aditional methods to the type */
  getUser(id: string): User {
    const user = this.players.getPlayer(id) as User;
    if (!user || user instanceof PokerBot)
      throw new Error("Error trying to get state");
    return user;
  }
}
