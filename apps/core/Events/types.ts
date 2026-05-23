import { Card } from "@repo/types";
import { Player } from "../types.ts";

type Event<T extends string, K> = {
  eventId: T;
  listener: (payload: K) => void;
};
export type EventKey<Payloads extends Record<string, any>> = Extract<
  keyof Payloads,
  string
>;
type EventListenerFunction<T> = (payload: T) => void;
export interface EventManager<Payloads extends Record<string, any>> {
  _eventsListeners: Partial<{
    [K in keyof Payloads]: Map<string, EventListenerFunction<Payloads[K]>>;
  }>;
  emit<T extends EventKey<Payloads>>(eventId: T, payload: Payloads[T]): void;
  createEmiter<T extends EventKey<Payloads>>(
    event: T,
  ): (payload: Payloads[T]) => void;
  on<T extends EventKey<Payloads>>(
    event: Event<T, Payloads[T]>,
    once?: boolean,
  ): string;
  createListeners<T extends EventKey<Payloads>>(
    events: T[],
    listener: (event: T, payload: any) => void,
    once?: boolean,
  ): string[];
  remove<T extends EventKey<Payloads>>(event: T, id: string): void;
  removeTransmiter(id: string): void;
  createTransmitter(event: (param: any) => void): string;
}
export type GameWinnerPayload = {
  moneyWin: number;
  gameState: Card[];
  winners: { player: Player; for: string }[];
};
