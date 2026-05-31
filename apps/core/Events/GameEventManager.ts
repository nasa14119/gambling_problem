import { Card } from "@repo/types";
import { EventManager } from "./EventsManager.ts";
import type { PlayerHand } from "@repo/types";
import type { Player, UserInput } from "../types.ts";
import { GameWinnerPayload } from "./types.ts";
import { BackBettting } from "../Players/types.ts";
export type GameEventPayloads = {
  "round:start": Player[];
  "round:start_turn": Player[];
  "turn:start": undefined;
  "turn:end": { moneyPot: number };
  "round:end": { round: number };
  "game:state_change": Card[];
  "deck:cards_deal": undefined;
  "deck:shuffle": undefined;
  "deck:flop": Card[];
  "deck:turn": Card[];
  "deck:river": Card[];
  "deck:update_player_hand": PlayerHand;
  "player:validbet": UserInput;
  "player:turn": Player["playerId"];
  "player:input": UserInput;
  "player:insuficientfunds": { min: number; player: Player };
  "player:timeexeded": { player: Player };
  "player:invalid_input": { error: string; player: Player };
  "player:withdraw": { chips: number; player: Player };
  "player:deposit": { chips: number; player: Player };
  "player:placedbet": { chips: number; player: Player["playerId"] };
  "round:winners": GameWinnerPayload;
  "mafia:pay": { money: number; player: Player["playerId"] };
  "mafia:backbet_activation": {
    player: Player["playerId"];
    payload: NonNullable<BackBettting>;
  };
  "mafia:backbet_end": { player: Player["playerId"] };
  "mafia:backbet_update": { player: Player };
  "reset:hard": undefined;
  "reset:soft": undefined;
  pause: undefined;
  resume: undefined;
};
export type GameEvents = keyof GameEventPayloads;
export type GameEventManagerType = EventManager<GameEventPayloads>;
export class GameEventManager extends EventManager<GameEventPayloads> {
  constructor() {
    super();
  }
}
