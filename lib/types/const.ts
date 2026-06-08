import { GameEventPayloads, GameEvents } from "./events.ts";

export const EXPLOITS = {
  SEE_FLOP: "see_flop",
  PICK_PLAYER: "pick_other_player",
  NO_SHUFFLE: "no_shuffle",
} as const;

const GAME_EVENTS = ["round:end"] as const;
type GameEventsKey = (typeof GAME_EVENTS)[number];

const GAME_EVENTS_SET: ReadonlySet<GameEvents> = new Set(GAME_EVENTS);
export type GameEventsExploit = Pick<GameEventPayloads, GameEventsKey>;

export const isExploitGameEvent = (
  exploit: GameEvents,
): exploit is keyof GameEventsExploit => GAME_EVENTS_SET.has(exploit);
