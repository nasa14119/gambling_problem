import { EventManager } from "./EventsManager.ts";
import { GameEventPayloads } from "@repo/types/server";
export type GameEventManagerType = EventManager<GameEventPayloads>;
export class GameEventManager extends EventManager<GameEventPayloads> {
  constructor() {
    super();
  }
}
