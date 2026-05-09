import { v4 as uuid } from "uuid";
import { GameEventManager, GameEvents } from "./Events/GameEventManager.ts";
import { DeckEventsManager } from "./Deck/DeckEventsFactory.ts";
import { Player } from "./Players/Player.ts";
import { Players } from "./Players/index.ts";
import { TurnSystem } from "./Deck/TurnSystem.ts";
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
    this.eventManager.on(
      {
        eventId: "deck:cards_deal",
        listener: () => this.turnSystem.startTurn(this.players.session()),
      },
      true,
    );
    this.eventManager.on({
      eventId: "round:end",
      listener: this.players.resetForNewRound,
    });
  }
  private waitForEvent<T extends GameEvents>(event: T) {
    return new Promise<void>((res) =>
      this.eventManager.on({ eventId: event, listener: () => res() }, true),
    );
  }
  determineWinner({ moneyPot }: { moneyPot: number }) {
    const players = this.players.getPlaingPlayers();
    if (players.length === 0) return;
    if (players.length < 2) {
      players[0].bank.addChips(moneyPot);
      return;
    }
    const winners = this.deck.determineWinner(players);
    if (winners.length < 2) {
      this.players.getPlayer(winners[0].playerId).bank.addChips(moneyPot);
      return;
    }
    moneyPot /= winners.length;
    winners.forEach((w) =>
      this.players.getPlayer(w.playerId).bank.addChips(moneyPot),
    );
  }

  async startRound() {
    this.eventManager.emit("round:start", this.players.session());
    await this.waitForEvent("deck:cards_deal");
    await this.turnSystem.startTurn(this.players.session());
    this.deck.flop();
    await this.turnSystem.startTurn(this.players.getPlaingPlayers());
    this.deck.turn();
    await this.turnSystem.startTurn(this.players.getPlaingPlayers());
    this.deck.river();
    await this.turnSystem.startTurn(this.players.getPlaingPlayers());
    this.eventManager.on(
      { eventId: "turn:end", listener: this.determineWinner.bind(this) },
      true,
    );
    this.eventManager.emit("round:end", undefined);
  }
  addPlayer(id: string) {
    const player = new Player({
      manager: this.eventManager.createManage(),
      playerId: id,
    });
    this.players.attachPlayer(player);
  }
}
// const game = new Game();
// game.addPlayer("player:1");
// game.addPlayer("palyer:2");
// game.init();
// game.startRound();
// game.eventManager.createListeners(
//   ["turn:end", "player:invalid_input", "player:insuficientfunds"],
//   (event, payload) => console.log({ event, payload }),
// );
// const send = game.eventManager.createEmiter("player:input");
// let player: Player | undefined;
// game.eventManager.on({
//   eventId: "player:turn",
//   listener: (payload) => {
//     player = game.players.players.get(payload);
//   },
// });
// // First round
// send({ type: "raise", chips: 10, player: player! });

// await new Promise((res) => setTimeout(res, 1000));
// send({ type: "pay", chips: 10, player: player! });

// // Second round
// await new Promise((res) => setTimeout(res, 1000));
// send({ type: "pay", chips: 0, player: player! });

// await new Promise((res) => setTimeout(res, 1000));
// send({ type: "pay", chips: 0, player: player! });
