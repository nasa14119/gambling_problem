import { Game } from "./Game.ts";
import {
  type GameEventPayloads,
  type GameEvents,
} from "./Events/GameEventManager.ts";
import type { Player } from "./types.ts";
import { z } from "zod";
export type GameEventPayload<T extends GameEvents> = {
  eventId: T;
  payload: GameEventPayloads[T];
};
type Props = {
  gameParam: Game;
  player: Player["playerId"];
  send: (payload: string) => void;
};
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
const SIGNALS: ReadonlySet<GameEvents> = new Set([
  "resume",
  "pause",
  "round:start",
]);
export class GameFacade {
  game: Game;
  player: Player;
  private send: Props["send"];
  private conection: string;
  constructor({ gameParam, player, send }: Props) {
    this.game = gameParam;
    this.player = this.game.players.getPlayer(player);
    this.conection = this.game.eventManager.createTransmitter(
      this.sendPayload.bind(this),
    );
    this.send = send;
    // Sending the player's cards
    if (this.player.cards !== null) {
      this.sendPayload({
        eventId: "round:start",
        payload: this.game.players.session(),
      });
    }
    // Sending the message that the playes is on turn
    if (this.game.turnSystem.playerPlaing !== null) {
      this.sendPayload({
        eventId: "player:turn",
        payload: this.game.turnSystem.playerPlaing,
      });
    }
    // Sending the current money pot
    if (this.game.turnSystem.moneyPot !== 0) {
      this.sendPayload({
        eventId: "turn:end",
        payload: { moneyPot: this.game.turnSystem.moneyPot ?? 0 },
      });
    }
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
      this.send(JSON.stringify({ eventId, payload: { error: data.error } }));
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
        return;
      }
      this.send(
        JSON.stringify({
          eventId,
          payload: this.game.turnSystem.getTurn(),
        }),
      );
      return;
    }
    // Players bet
    if (eventId === "player:validbet") {
      const payloadBet = payload as GameEventPayloads["player:validbet"];
      this.send(
        JSON.stringify({
          eventId,
          payload: {
            type: payloadBet.type,
            chips: payloadBet.chips,
            player: this.game.players
              .getPlayer(payloadBet.player.playerId)
              .getData(),
          },
        }),
      );
      return;
    }
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
    if (eventId === "deck:cards_deal") {
      this.send(JSON.stringify({ eventId, payload: this.player.cards }));
    }
    // console.log("unhandle " + eventId);
  }
  handleInput(input: string) {
    try {
      JSON.parse(input);
    } catch {
      this.send("Error parsing JSON DATA");
      return;
    }
    const { eventId, payload } = JSON.parse(input);
    if (eventId === "player:info") {
      this.send(
        JSON.stringify({
          eventId: "player:info_data",
          payload: this.player.getData(),
        }),
      );
      this.getPlayersPots();
      return;
    }
    if (!eventId || typeof eventId !== "string") return;
    if (SIGNALS.has(eventId as GameEvents)) {
      if (eventId === "round:start") {
        this.game.startRound();
        return;
      }
      this.game.eventManager.emit(eventId as GameEvents, undefined);
      return;
    }
    if (eventId === "player:input") {
      const data = validatePayload(eventId, payload);
      if (!data) return;
      this.game.eventManager.emit("player:input", {
        chips: data.chips,
        player: this.player,
        type: data.type,
      });
    }
    if (eventId === "player:deposit" || eventId === "player:withdraw") {
      const data = payload as { chips: number };
      this.game.eventManager.emit(eventId, {
        chips: data.chips,
        player: this.player,
      });
      return;
    }
  }
  terminate() {
    this.game.eventManager.removeTransmiter(this.conection);
  }
}
