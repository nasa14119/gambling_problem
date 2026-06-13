/* 
  Here is encapsulated the logic for unlocking exploits, will change level base on db 
  Will also indicate when the game is a win 
*/

// Imports
import { getRank, getUserWhiteList, isMaxRank, saveRank } from "db";
import type { Player } from "./Player.ts";
import { ExploitId } from "@repo/types";
import { ExpoitEventManager } from "../Events/ExploitsEventManager.ts";
import { ExploitData, NextRank } from "@repo/types/db";

// Types
type RankConstructor = {
  player: Player;
  exploits_whitelist: ExploitId[];
  exploitsManager: ExpoitEventManager;
};
type RankOptions = {
  current_level: number;
};

export class Rank {
  // The players this rank belongs to
  player: Player;
  //
  private exploits_unlocked: Set<ExploitId>;
  // This are the user's unlocked exploits globaly
  private user_whitelist!: ExploitData[];
  // This is the amount of money and chips the player has at the moment
  private rank: number;
  // Internal variable to know the new minimun so that if you go to a lower level you don't unlock exploits again
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

  /** Method call for setup of rank class */
  async init() {
    const res = await getUserWhiteList(this.player.playerId);
    this.user_whitelist = res;
    if (await isMaxRank(this.rank)) {
      this.eventManager.emit("rank:max", { rank: this.rank });
      this.nextRank = null;
      return;
    }
    await this.getNextRank();
  }

  /** Will get the next exploit the players is going to get */
  async getNextRank() {
    /** List of the epxloits that where unlocked by the player but are not unlocked in the current game */
    const list = this.user_whitelist.filter(
      (e) => !this.exploits_unlocked.has(e.exploitId),
    );

    /** Stored the values that are in between the current rank and the one next
     * (this is because you can pass more than one rank in a round end) */
    const dbRankValues = await getRank({
      currentLevel: this.rank,
      prevRank: this.nextRank?.rank ?? 0,
    });

    if (dbRankValues === null) {
      // if there is not other rank to unlock then the max level is reach
      this.nextRank = null;
      this.eventManager.emit("rank:max", { rank: this.getRank() });
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
          this.exploits_unlocked.add(exploit.exploitId);
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

  /** Will save in the database the exploit the player have unlocked if it wasent on his whitelist */
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

  /** Will be call in case the rank have surpase the prev rank */
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

  /** Get information of the player is aspirating to get */
  getNextGoal() {
    if (!this.nextRank) return null;
    return this.nextRank.rank;
  }

  /** Current rank of the player */
  getRank() {
    return this.rank;
  }
}
