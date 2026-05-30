import type {
  GameEventManager,
  GameEvents,
} from "../Events/GameEventManager.ts";
import { Player } from "../types.ts";
import { setTimeout as sleep } from "node:timers/promises";
type Constructor = {
  /**@type {number} seconds of the timer */
  time: number;
  manager: ReturnType<GameEventManager["createManage"]>;
  player: Player;
  onEnd: () => void;
};
export class Timer {
  private time: Constructor["time"];
  private manager: Constructor["manager"];
  private onEnd: () => void;
  private isPaused: boolean = false;
  private player: Constructor["player"];
  private ids: { [key in GameEvents]?: string } = {};
  private interval: NodeJS.Timeout;
  constructor({ time, manager, onEnd, player }: Constructor) {
    this.player = player;
    this.time = time;
    this.manager = manager;
    this.interval = setInterval(() => {
      if (this.isPaused) return;
      this.time -= 1;
      if (this.time <= 0) {
        this.end();
      }
    }, this.time * 1000);
    this.onEnd = onEnd;
    this.ids["pause"] = this.manager.on({
      eventId: "pause",
      listener: this.pause.bind(this),
    });
    this.ids["resume"] = this.manager.on({
      eventId: "resume",
      listener: this.resume.bind(this),
    });
    this.timer();
  }
  private pause() {
    this.isPaused = true;
  }
  private resume() {
    this.isPaused = false;
    this.timer();
  }
  private timer = async () => {
    if (this.isPaused) return;
    if (this.time === 0) return;
    this.time -= 1;
    await sleep(1000);
    this.timer();
  };
  private end() {
    this.clean();
    this.onEnd();
    this.manager.emit("player:timeexeded", this.player);
  }
  cancel() {
    this.clean();
  }
  private clean() {
    clearInterval(this.interval);
    Object.entries(this.ids).forEach(([key, id]) => {
      this.manager.remove(key as GameEvents, id);
    });
  }
}
