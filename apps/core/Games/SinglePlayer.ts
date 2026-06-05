import { SavedGame, SiglePlayerOptions, User } from "../types.ts";
import { Game } from "../Game.ts";
import { GameFacade } from "../GameFacade.ts";
import { getExploitData, saveAndTerminateRun, updateRun } from "db";
import { Inventory } from "../Players/Inventory.ts";
import { Player } from "../Players/Player.ts";
import { Mafia } from "../Players/Mafia.ts";
import { PlayerOptions } from "../Players/types.ts";
import { PokerBot } from "../Players/Bot.ts";
import { GameState } from "@repo/types";
import { BankData } from "@repo/types/server";
import { Rank } from "../Players/Rank.ts";

export class GameSinglePlayer extends Game {
  level = 0;
  nextRank = 10_000;
  public terminate: null | (() => Promise<void>) = null;
  constructor({ savedGame, ...gameOptions }: SiglePlayerOptions = {}) {
    super(gameOptions);
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
  async quit(playerId: string) {
    const save = this.save(playerId);
    const user = this.getUser(playerId);
    this.eventManager.emit("reset:quit", undefined);
    await updateRun(Number(this.id), {
      level: this.level,
      moneySpend: user.bank.moneySpend,
      moneyTotal: user.bank.moneyTotal,
    });
    return save;
  }
  async kill(playerId: string) {
    if (!this.isEnded) this.isEnded = "TERMINATED";
    try {
      await this.terminate?.();
      const playerScore = (
        this.players.getPlayer(playerId) as User
      ).bank.getGameState();
      await saveAndTerminateRun(Number(this.id), {
        level: this.level,
        typeEnd: this.isEnded,
        ...playerScore,
      });
    } catch {
      throw new Error("Error trying to update run");
    }
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
    this.exploitsManager.eventManger.on({
      eventId: "levelup",
      listener: ({ level, playerId }) => {
        this.level = level;
        this.eventManager.emit("levelup", { level, playerId });
      },
    });
    this.exploitsManager.eventManger.on({
      eventId: "exploit:unlocked",
      listener: ({ exploit: { exploitId } }) => {
        this.exploits_whitelist.push(exploitId);
      },
    });
    if (this._isStarted) {
      this.resumeGame();
    }
  }
  attachClient(
    player: Player["playerId"],
    send: (payload: string) => void,
  ): GameFacade {
    const facade = new GameFacade({ gameParam: this, player, send });
    return facade;
  }
  getUserBank(id: string): BankData {
    const user = this.players.getPlayer(id) as User;
    return {
      money: user.bank.getMoneyValue(),
      chips: user.bank.getChipsValue(),
      next_rank: user.rank.getNextGoal(),
      current_rank: user.rank.getRank(),
      ...user.mafia.getMafiaData(),
    };
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
    const rank = new Rank(
      {
        player,
        exploits_whitelist: this.exploits_whitelist,
        exploitsManager: this.exploitsManager.eventManger,
      },
      { current_level: 0 },
    );
    player.bank.updateRank = rank.updateRank.bind(rank);
    rank.updateRank(player.bank.earnings);
    player.rank = rank;
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
  protected getUser(id: string): User {
    const user = this.players.getPlayer(id) as User;
    if (!user || user instanceof PokerBot)
      throw new Error("Error trying to get state");
    return user;
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
}
