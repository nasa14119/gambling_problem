import { v4 as uuid } from "uuid";
import { GameEventManager } from "./Events/GameEventManager.ts";
import { DeckEventsManager } from "./Deck/DeckEventsFactory.ts";
import { Player } from "./Players/Player.ts";
import { Players } from "./Players/index.ts";
import { TurnSystem } from "./Deck/TurnSystem.ts";
import { GameFacade } from "./GameFacade.ts";
import { PokerBot } from "./Players/Bot.ts";
import type { Card, ExploitId, GameState } from "@repo/types";
import { Inventory } from "./Players/Inventory.ts";
import { ExploitManager } from "./Exploits/ExploitManager.ts";
import { ExploitFacade } from "./Exploits/ExploitFacade.ts";
import { BankData, SavedGame, User } from "@repo/types/server";
import { GameOptions } from "./types.ts";
import { Mafia } from "./Players/Mafia.ts";
import type { TypeEnd } from "@repo/types/db";
import { getExploitData, updateRun } from "db";
import { PlayerOptions } from "./Players/types.ts";

export class Game {
  id: string;
  eventManager = new GameEventManager();
  deck = new DeckEventsManager(this.eventManager);
  players = new Players();
  turnSystem = new TurnSystem(this.eventManager);
  exploitsManager = new ExploitManager(this);
  level = 0;
  public exploits_whitelist: ExploitId[] = [];
  private _isStarted = false;
  public round: number = 0;
  public isEnded: TypeEnd | null = null;
  nextRank = 10_000;
  public terminate: null | (() => Promise<void>) = null;
  constructor({ runId, exploits_whitelist = [], savedGame }: GameOptions = {}) {
    this.id = runId?.toString() ?? uuid();
    this.round = 0;
    this.exploits_whitelist = [
      "see_flop",
      "pick_other_player",
      "no_shuffle",
      ...exploits_whitelist,
    ];
    if (savedGame) this.loadGame(savedGame);
  }
  public loadGame(savedGame: SavedGame) {
    this.addPlayer(savedGame.playerId, {
      stored: {
        invetory: savedGame.invetory,
        user: savedGame.user,
        mafia: savedGame.mafia,
      },
    });
    savedGame.players.forEach((p) => {
      this.addBot(p.playerId, {
        saved: p,
      });
    });
    this.id = savedGame.runId;
    this.round = savedGame.round;
    this.exploits_whitelist = savedGame.exploits_whitelist;
    this.level = savedGame.level;
    this.deck.loadDeck(savedGame.deck);
    this.exploitsManager.loadExploits(
      savedGame.invetory.active,
      savedGame.playerId,
      savedGame.exploitStore,
    );
    this._isStarted = savedGame.isStarted;
    if (savedGame.turn !== null) {
      const turn = savedGame.turn;
      const waiting_queue = this.players
        .session()
        .filter((p) =>
          turn.waiting_queue.some((w) => w.playerId === p.playerId),
        );
      const turn_queue = this.players
        .session()
        .filter((p) => turn.turn_queue.some((w) => w.playerId === p.playerId));
      this.turnSystem.loadTurn({ ...turn, waiting_queue, turn_queue });
    }
  }
  private async resumeGame() {
    if (!this.turnSystem.isIdle) {
      await this.turnSystem.resumeTurn();
      if (this.deck.gameState.length === 5) {
        this.roundEnd();
        return;
      }
    }
    if (!this.canPlay()) {
      this.roundEnd();
      return;
    }
    if (this.deck.gameState.length === 0) {
      this.deck.flop();
      await this.turnSystem.startTurn(this.players.getPlaingPlayers());
      if (!this.canPlay()) {
        this.roundEnd();
        return;
      }
    }
    if (this.deck.gameState.length === 3) {
      this.deck.turn();
      await this.turnSystem.startTurn(this.players.getPlaingPlayers());
      if (!this.canPlay()) {
        this.roundEnd();
        return;
      }
    }
    this.deck.river();
    await this.turnSystem.startTurn(this.players.getPlaingPlayers());
    this.roundEnd();
  }
  save(id: string): SavedGame {
    const user = this.players.getPlayer(id) as User;
    return {
      isStarted: this.isStarted,
      playerId: user.playerId,
      runId: this.id,
      round: this.round,
      exploits_whitelist: this.exploits_whitelist,
      level: this.level,
      deck: {
        ...this.deck.saveDeck(),
      },
      players: this.players
        .session()
        .filter((p) => p.playerId !== id)
        .map((p) => p.getData()),
      turn: this.turnSystem.getSave(),
      user: {
        money: user.bank.getMoneyValue(),
        chips: user.bank.getChipsValue(),
        ...user.bank.getGameState(),
        next_rank: this.nextRank,
        card: user.cards,
        isFold: user.isFold,
      },
      mafia: {
        ...user.mafia.getSave(),
      },
      invetory: {
        itmes: user.invetory.saveItems(),
        active: this.exploitsManager.getActiveSavePlayer(id),
      },
      exploitStore: this.exploitsManager.exploitsStore,
    };
  }
  quit(playerId: string) {
    const save = this.save(playerId);
    this.eventManager.emit("reset:quit", undefined);
    return save;
  }
  async kill(playerId: string) {
    if (!this.isEnded) this.isEnded = "TERMINATED";
    try {
      const playerScore = (
        this.players.getPlayer(playerId) as User
      ).bank.getGameState();
      await this.terminate?.();
      await updateRun(Number(this.id), {
        level: this.level,
        typeEnd: this.isEnded,
        ...playerScore,
      });
    } catch {
      throw new Error("Error trying to update run");
    }
  }
  private getUser(id: string): User {
    const user = this.players.getPlayer(id) as User;
    if (!user || user instanceof PokerBot)
      throw new Error("Error trying to get state");
    return user;
  }
  async getUserStore(playerId: string) {
    const user = this.players.getPlayer(playerId) as User;
    if (!user || user instanceof PokerBot)
      throw new Error("Error trying to get state");
    const exploitsActive = new Set(
      this.exploitsManager.eventManger
        .getActiveExploitsPlayer(playerId)
        .map((e) => e.type),
    );
    const store = await Promise.all(
      this.exploits_whitelist.map((e) => getExploitData(e)),
    );
    return store.map((e) => ({
      ...e,
      isAvailable:
        !exploitsActive.has(e.exploitId) &&
        !user.invetory.includes(e.exploitId),
    }));
  }
  getState(id: string): GameState {
    const user = this.getUser(id);
    const { [id]: _, ...players } = { ...this.players.getPlayersData() };
    return {
      isStarted: this._isStarted,
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
    this.eventManager.on({
      eventId: "reset:hard",
      listener: ({ end, player }) => {
        this.isEnded = end;
        this.kill(player);
      },
    });
    if (this._isStarted) {
      this.resumeGame();
    }
  }
  get isStarted() {
    return this._isStarted;
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
  getUserBank(id: string): BankData {
    const user = this.players.getPlayer(id) as User;
    return {
      money: user.bank.getMoneyValue(),
      chips: user.bank.getChipsValue(),
      next_rank: this.nextRank,
      ...user.mafia.getMafiaData(),
    };
  }
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
  roundEnd() {
    this._isStarted = false;
    this.determineWinner({
      moneyPot: this.turnSystem.moneyPot ?? 0,
      state: [...this.deck.gameState],
    });
    this.replaceBrokeBots();
    this.eventManager.emit("round:end", { round: this.round });
  }
  canPlay() {
    if (this.isEnded) return false;
    return this.players.getPlaingPlayers().length > 1;
  }
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
  addPlayer(id: string, options: PlayerOptions = {}) {
    const invetory = new Inventory(this.exploitsManager.eventManger, id);
    const player = new Player(
      {
        manager: this.eventManager.createManage(),
        playerId: id,
        invetory,
      },
      options,
    );
    const mafia = new Mafia(this, player);
    player.mafia = mafia;
    if (options?.stored?.mafia) {
      mafia.loadMafia(options.stored.mafia);
    }
    this.players.attachPlayer(player);
  }
  addBot(id: string, options?: { saved?: SavedGame["players"][number] }) {
    const bot = new PokerBot({
      difficulty: "easy",
      playerId: id,
      manager: this.eventManager.createManage(),
    });
    if (options?.saved) {
      bot.bank.setChips(options.saved.chips);
      bot.cards = options.saved.cards;
      bot.isFold = options.saved.isFold;
    }
    this.players.attachPlayer(bot);
  }
  private replaceBrokeBots() {
    const brokeBots = this.players
      .session()
      .filter(
        (player): player is PokerBot =>
          player instanceof PokerBot && player.bank.getChipsValue() <= 0,
      );

    brokeBots.forEach((bot) => {
      bot.dispose();
      this.players.detachPlayer(bot);
      this.addBot(bot.playerId);
    });
  }
}
