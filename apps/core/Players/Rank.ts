import {
  getExploitData,
  getRank,
  getUserWhiteList,
  saveRank,
  type NextRank,
} from "db";
import type { Player } from "./Player.ts";
import { ExploitId } from "@repo/types";
import { ExpoitEventManager } from "../Events/ExploitsEventManager.ts";

type RankConstructor = {
  player: Player;
  exploits_whitelist: ExploitId[];
  exploitsManager: ExpoitEventManager;
};
type RankOptions = {
  current_level: number;
};
export class Rank {
  player: Player;
  private exploits_unlocked: Set<ExploitId>;
  private user_whitelist!: ExploitId[];
  private rank: number;
  private eventManager: ExpoitEventManager;
  private level: number = 0;
  private nextRank: NextRank | null = null;
  constructor(
    { player, exploits_whitelist, exploitsManager }: RankConstructor,
    options?: RankOptions,
  ) {
    this.player = player;
    this.exploits_unlocked = new Set(exploits_whitelist);
    this.rank = options?.current_level ?? 0;
    this.eventManager = exploitsManager;
    this.init();
  }
  async init() {
    const res = await getUserWhiteList(this.player.playerId);
    this.user_whitelist = res.map((e) => e.Whitelist.exploitId as ExploitId);
    await this.getNextRank();
  }
  async getNextRank() {
    const list = this.user_whitelist.filter(
      (e) => !this.exploits_unlocked.has(e),
    );
    const dbRank = await getRank({ currentLevel: this.rank });
    if (!dbRank) {
      this.nextRank = null;
      return;
    }
    if (dbRank.level > this.level) {
      this.level = dbRank.level;
      this.eventManager.emit("levelup", {
        playerId: this.player.playerId,
        level: this.level,
      });
    }
    if (list.length !== 0) {
      const index = Math.floor(Math.random() * list.length);
      const newExploit = list.splice(index, 1)[0];
      const exploitData = await getExploitData(newExploit);
      this.nextRank = {
        ...exploitData,
        rank: dbRank.rank,
        level: dbRank.level,
      };
      return;
    }
    await saveRank({
      exploitId: dbRank.exploitId,
      username: this.player.playerId,
    });
    this.nextRank = dbRank;
  }
  updateRank(money: number) {
    this.rank = money;
    if (this.nextRank === null) return;
    if (this.rank >= this.nextRank.rank) {
      this.eventManager.emit("exploit:unlocked", {
        exploit: this.nextRank,
        playerId: this.player.playerId,
      });
      this.getNextRank();
    }
  }
  getNextGoal() {
    if (!this.nextRank) return null;
    return this.nextRank.rank;
  }
  getRank() {
    return this.rank;
  }
}
