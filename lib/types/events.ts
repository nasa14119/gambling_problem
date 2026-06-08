import { Card, ExploitId, Player, PlayerHand, TurnOptions } from "./app.ts";
import { GameEventsExploit } from "./const.ts";
import { ExploitData, NextRank, TypeEnd } from "./db.ts";
import { BackBettting, GameWinnerPayload, PlayerData } from "./server.ts";

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
  "reset:hard": { end: TypeEnd; player: Player["playerId"] };
  "reset:soft": undefined;
  "reset:quit": undefined;
  levelup: { level: number; playerId: Player["playerId"] };
  pause: undefined;
  resume: undefined;
  "bot:reset": { prevPlayer: PlayerData; newPlayer: PlayerData };
};
export type GameEvents = keyof GameEventPayloads;

export type UserInput = {
  type: TurnOptions;
  player: Player;
  chips: number;
};

export type ExploitsPayloads = {
  "exploit:buy": Omit<ExploitBuyPayload, "price">;
  "exploit:trigger": ExploitTriggerPayload;
  "exploit:wastrigger": ExploitTriggerPayload;
  "buy:error": {
    playerId: Player["playerId"];
    error: string;
    exploit: ExploitId;
  };
  "buy:success": {
    playerId: Player["playerId"];
    exploit: ExploitData;
    newBalance: number;
  };
  "player:trigger": ExploitTriggerPayload;
  "trigger:error": {
    playerId: Player["playerId"];
    error: string;
    exploitId: ExploitId;
  };
  "exploit:event": {
    from: ExploitId;
    playerId: Player["playerId"];
    payload: unknown;
  };
  "exploit:kill": { playerId: Player["playerId"]; exploitId: ExploitId };
  "exploit:unlocked": { playerId: Player["playerId"]; exploit: NextRank };
  levelup: { playerId: Player["playerId"]; level: number };
} & GameEventsExploit;
export type ExploitsEvents = keyof ExploitsPayloads;

export type GameEventValue<T extends GameEvents> = {
  eventId: T;
  payload: GameEventPayloads[T];
};
export type ExploitEventValue<T extends ExploitsEvents> = {
  eventId: T;
  payload: ExploitsPayloads[T];
};
export type ExploitEventPayload = {
  [K in ExploitsEvents]: ExploitEventValue<K>;
}[ExploitsEvents];
export type GameEvent = {
  [K in GameEvents]: GameEventValue<K>;
}[GameEvents];

export type ExploitBuyPayload = {
  exploitId: ExploitId;
  playerId: Player["playerId"];
  price: number;
};

export type ExploitTriggerPayload = {
  exploitId: ExploitId;
  playerId: Player["playerId"];
};
