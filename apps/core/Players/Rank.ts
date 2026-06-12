import { getRank, getUserWhiteList, saveRank } from "db";
import type { Player } from "./Player.ts";
import { ExploitId } from "@repo/types";
import { ExpoitEventManager } from "../Events/ExploitsEventManager.ts";
import { ExploitData, NextRank } from "@repo/types/db";

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
  private user_whitelist!: ExploitData[];
  private rank: number;
  private minRank: number = 0;
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
    this.user_whitelist = res;
    await this.getNextRank();
  }
  async getNextRank() {
    const list = this.user_whitelist.filter(
      (e) => !this.exploits_unlocked.has(e.exploitId),
    );
    const dbRankValues = await getRank({
      currentLevel: this.rank,
      prevRank: this.nextRank?.rank ?? 0,
    });
    if (dbRankValues === null) {
      this.nextRank = null;
      return;
    }
    for (const dbRank of dbRankValues) {
      if (list.length !== 0) {
        const index = Math.floor(Math.random() * list.length);
        const newExploit = list.splice(index, 1)[0];
        const exploit = {
          ...newExploit,
          rank: dbRank.rank,
          level: dbRank.level,
        };
        if (dbRank.rank < this.rank) {
          this.eventManager.emit("exploit:unlocked", {
            exploit,
            playerId: this.player.playerId,
          });
        } else {
          this.nextRank = {
            ...exploit,
          };
        }
        if (dbRank.level > this.level) {
          this.level = dbRank.level;
          this.eventManager.emit("levelup", {
            playerId: this.player.playerId,
            level: this.level,
          });
        }
        continue;
      }
      if (dbRank.level > this.level) {
        this.level = dbRank.level;
        this.eventManager.emit("levelup", {
          playerId: this.player.playerId,
          level: this.level,
        });
      }
      if (dbRank.rank < this.rank) {
        this.eventManager.emit("exploit:unlocked", {
          exploit: dbRank,
          playerId: this.player.playerId,
        });
        this.nextRank = null;
      } else {
        this.nextRank = dbRank;
      }
    }
  }
  private updateUnlocket() {
    if (this.nextRank === null) return;
    if (
      this.user_whitelist.some((u) => u.exploitId === this.nextRank!.exploitId)
    )
      return;
    saveRank({
      exploitId: this.nextRank.exploitId,
      username: this.player.playerId,
    });
  }
  updateRank(money: number) {
    this.rank = Math.max(this.minRank, money);
    if (this.nextRank === null) return;
    if (this.rank >= this.nextRank.rank) {
      this.minRank = this.nextRank.rank;
      this.updateUnlocket();
      this.eventManager.emit("exploit:unlocked", {
        exploit: this.nextRank,
        playerId: this.player.playerId,
      });
      this.exploits_unlocked.add(this.nextRank.exploitId);
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
