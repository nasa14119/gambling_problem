import { Card } from "@repo/types";
import { EventManager } from "./EventsManager";
import type { TurnOptions, PlayerHand } from "@repo/types";
import type { Player } from "../types";
export type GameEventPayloads = {
  "round:start": Player[];
  "round:start_turn": Player[];
  "turn:end": { moneyPot: number };
  "round:end": undefined;
  "game:state_change": Card[];
  "deck:cards_deal": undefined;
  "deck:shuffle": undefined;
  "deck:flush": Card[];
  "deck:turn": Card[];
  "deck:river": Card[];
  "deck:update_player_hand": PlayerHand;
  "player:validbet": { type: TurnOptions; chips: number; player: Player };
  "player:insuficientfunds": { min: number; player: Player };
  "player:turn": Player["playerId"];
  "player:input": { type: TurnOptions; chips: number; player: Player };
  "player:timeexeded": Player;
  "player:invalid_input": { error: string; player: Player };
};
export type GameEvents = keyof GameEventPayloads;
export type GameEventManagerType = EventManager<GameEventPayloads>;
export class GameEventManager extends EventManager<GameEventPayloads> {
  constructor() {
    super();
  }
}
