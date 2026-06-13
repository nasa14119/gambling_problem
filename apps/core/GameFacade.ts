/* 
  This is the Game Facade 
  Here is the code that the session system uses to attach a web socket to a game 
  The send function is the what what will send send the informatios as a stringify json document 
  The types and functions that are asociated to this class are also here for clarity
*/
// Imports
import {
  GameEventPayloads,
  GameEvents,
  GameEventValue,
} from "@repo/types/server";
import { Game } from "./Game.ts";
import { z } from "zod";
import { GameState, Player } from "@repo/types";
import { sleep } from "./lib/utils.ts";

//  Types and constants
export type GameEventPayload<T extends GameEvents> = {
  eventId: T;
  payload: GameEventPayloads[T];
};
type Props = {
  gameParam: Game;
  player: Player["playerId"];
  send: (payload: string) => void;
};

/** Client side triggers for specific actions */
const SIGNALS: ReadonlySet<GameEvents> = new Set([
  "resume",
  "pause",
  "round:start",
]);

// This functions is validating the input of the user for security porpuse
const validatePayload = (eventId: string, payload: unknown) => {
  if (eventId === "player:input") {
    const value = z
      .object({
        type: z.union([
          z.literal("fold"),
          z.literal("raise"),
          z.literal("pay"),
          z.literal("check"),
        ]),
        chips: z.number(),
      })
      .safeParse(payload) as z.SafeParseReturnType<
      unknown,
      GameEventPayloads["player:input"]
    >;
    if (!value.success) return;
    return value.data;
  }
};

export class GameFacade {
  game: Game;
  player: Player;
  private send: Props["send"];
  private conection: string;
  private eventQueue: GameEventPayload<GameEvents>[] = [];
  private busy: boolean = false;

  constructor({ gameParam, player, send }: Props) {
    this.game = gameParam;
    this.player = this.game.players.getPlayer(player);
    this.conection = this.game.eventManager.createTransmitter(
      this.add.bind(this),
    );
    this.send = send;
    // Sending the message that the playes is on turn
    if (this.game.isStarted) {
      this.sendPayload({
        eventId: "player:turn",
        payload: this.game.turnSystem.getTurn()!.currentPlayer,
      });
    }
  }

  // queue to ensure all events are send in order
  private add<T extends GameEvents>(event: GameEventPayload<T>) {
    this.eventQueue.push(event);
    this.dispatch();
  }

  private async dispatch() {
    if (this.busy) return;
    this.busy = true;
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift()!;
      this.sendPayload(event);
      await sleep(10);
    }
    this.busy = false;
  }

  private getPlayersPots() {
    // Sending the players money pot
    for (const [playerId, moneyPot] of Object.entries(
      this.game.turnSystem.players_pots,
    )) {
      this.send(
        JSON.stringify({
          eventId: "player:placedbet",
          payload: {
            chips: moneyPot,
            player: playerId,
          },
        }),
      );
    }
  }

  sendPayload<T extends GameEvents>({ eventId, payload }: GameEventPayload<T>) {
    // Turn end
    if (eventId === "turn:end") {
      const data = payload as GameEventPayloads["turn:end"];
      this.send(
        JSON.stringify({
          eventId: "turn:end",
          payload: data,
        }),
      );
      return;
    }
    // Errors in turn
    if (
      eventId === "player:invalid_input" ||
      eventId === "player:timeexeded" ||
      eventId === "player:insuficientfunds"
    ) {
      const data = payload as { player: Player; error: string };
      if (data.player.playerId !== this.player.playerId) return;
      this.send(
        JSON.stringify({
          eventId,
          payload: { player: this.player.getData(), error: data?.error },
        }),
      );
    }
    // Game Start
    if (eventId === "round:start") {
      const players = payload as Player[];
      const [playerData] = players
        .filter((p) => p.playerId === this.player.playerId)
        .map((p) => p.getData());
      this.send(JSON.stringify({ eventId, payload: playerData }));
      return;
    }
    // Decks events
    if (
      new Set<GameEvents>([
        "deck:flop",
        "deck:river",
        "deck:turn",
        "deck:shuffle",
        "round:end",
      ]).has(eventId)
    ) {
      this.send(
        JSON.stringify({
          eventId,
          payload,
        }),
      );
      return;
    }
    // Players turn
    if (eventId === "player:turn") {
      const payloadTurn = payload as GameEventPayloads["player:turn"];
      if (payloadTurn === this.player.playerId) {
        this.send(
          JSON.stringify({
            eventId: "user:turn",
            payload: this.player.getData(),
          }),
        );
      }
      this.send(
        JSON.stringify({
          eventId,
          payload: this.game.turnSystem.getTurn(),
        }),
      );
      return;
    }
    // Players bet (that was already validated)
    if (eventId === "player:validbet") {
      const payloadBet = payload as GameEventPayloads["player:validbet"];
      const player = this.game.players
        .getPlayer(payloadBet.player.playerId)
        .getData();
      player["cards"] = null;
      this.send(
        JSON.stringify({
          eventId,
          payload: {
            type: payloadBet.type,
            chips: payloadBet.chips,
            player,
          },
        }),
      );
      return;
    }

    // Winner determinated
    if (eventId === "round:winners") {
      const data = payload as GameEventPayloads["round:winners"];
      const winners = data.winners.map((w) => ({
        ...w.player.getData(),
        for: w.for,
      }));
      this.send(
        JSON.stringify({
          eventId,
          payload: {
            winners,
            gameState: data.gameState,
            moneyWin: data.moneyWin,
          },
        }),
      );
      return;
    }
    // Cards where deal
    if (eventId === "deck:cards_deal") {
      this.send(JSON.stringify({ eventId, payload: this.player.cards }));
    }

    // Types of game termination
    if (
      eventId === "reset:hard" ||
      eventId === "reset:soft" ||
      eventId === "reset:quit"
    ) {
      this.send(JSON.stringify({ eventId, payload: undefined }));
    }

    // Level up event
    if (eventId === "levelup") {
      setTimeout(() => {
        const players: GameState["players"] = this.game.players
          .session()
          .filter((v) => v.playerId !== this.player.playerId)
          .reduce((p, c) => {
            const { money, cards, ...rest } = c.getData();
            return { ...p, [c.playerId]: rest };
          }, {});
        const { level } = payload as GameEventValue<"levelup">["payload"];
        this.send(
          JSON.stringify({ eventId, payload: { level: level, players } }),
        );
      }, 500);
    }

    // This is when the is broke and needs to be replace with other one
    if (eventId === "bot:reset") {
      this.send(JSON.stringify({ eventId, payload }));
    }
  }

  // Client incoming events manager
  handleInput(input: string) {
    try {
      JSON.parse(input); // Validation for json format is correct form
    } catch {
      this.send("Error parsing JSON DATA");
      return;
    }
    const { eventId, payload } = JSON.parse(input); // Client event

    if (eventId === "player:info") {
      // This is kind of legacy but is an event to get the current ifnormation about all the players in the game
      this.send(
        JSON.stringify({
          eventId: "player:info_data",
          payload: this.player.getData(),
        }),
      );
      this.getPlayersPots();
      return;
    }

    // Validates the for the type of eventId is string as expected
    if (!eventId || typeof eventId !== "string") return;

    // Trigger events of client
    if (SIGNALS.has(eventId as GameEvents)) {
      if (eventId === "round:start") {
        this.game.startRound();
        return;
      }
      this.game.eventManager.emit(eventId as GameEvents, undefined);
      return;
    }

    // This is what the player is trying to do
    if (eventId === "player:input") {
      const data = validatePayload(eventId, payload);
      if (!data) return;
      this.game.eventManager.emit("player:input", {
        chips: data.chips,
        player: this.player,
        type: data.type,
      });
    }

    // As is implied actions asociated to convertion between money and chips
    if (eventId === "player:deposit" || eventId === "player:withdraw") {
      const data = payload as { chips: number };
      this.game.eventManager.emit(eventId, {
        chips: data.chips,
        player: this.player,
      });
      return;
    }

    // Mafia, tring to pay debt
    if (eventId === "mafia:pay") {
      const data = payload as { money: number; player: Player["playerId"] };
      if (typeof data.money !== "number") return;
      this.game.eventManager.emit("mafia:pay", {
        money: data.money,
        player: this.player.playerId,
      });
    }
  }

  /** Termination the websocket connection with the game (removing the event listeners / this facade) */
  terminate() {
    this.game.eventManager.removeTransmiter(this.conection);
  }
}
