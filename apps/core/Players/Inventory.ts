import { ExploitId, GameState } from "@repo/types";
import { ExpoitEventManager } from "../Events/ExploitsEventManager.ts";
import { Player } from "./Player.ts";
import { getExploitData } from "db";
import { ExploitData } from "@repo/types/db";

type InventoryOptions = {
  initialItems?: ExploitId[];
};
export class Inventory {
  private items: Map<ExploitId, ExploitData> = new Map();
  constructor(
    private exploitsManager: ExpoitEventManager,
    private player: Player["playerId"],
    options: InventoryOptions = {},
  ) {
    if (options.initialItems) {
      options.initialItems.forEach(this.addItem.bind(this));
    }
    this.exploitsManager.on({
      eventId: "player:trigger",
      listener: (payload) => {
        if (payload.playerId !== this.player) return;
        const canTrigger = this.useItem(payload.exploitId);
        if (!canTrigger) return;
      },
    });
  }
  getItemInfo(item: ExploitId): ExploitData {
    if (!this.includes(item)) throw new Error("Item not found");
    return this.items.get(item)!;
  }
  includes = (item: ExploitId) => this.items.has(item);
  async addItem(item: ExploitId) {
    if (this.includes(item)) throw new Error("Item already exists");
    this.exploitsManager.addTrigger({ exploitId: item, playerId: this.player });
    const data = await getExploitData(item);
    this.items.set(item, data);
    this.exploitsManager.emit("exploit:invetory:add", {
      exploit: data,
      playerId: this.player,
    });
  }
  getItems(): GameState["user"]["invetory"] {
    return Array.from(this.items, ([_, val]) => val);
  }
  saveItems() {
    return [...this.items].map<ExploitId>(([key]) => key);
  }
  useItem(item: ExploitId) {
    if (!this.includes(item)) {
      this.exploitsManager.emit("trigger:error", {
        error: "Item not found in invetory",
        playerId: this.player,
        exploitId: item,
      });
      return false;
    }
    this.exploitsManager.emit("exploit:trigger", {
      exploitId: item,
      playerId: this.player,
    });
    this.items.delete(item);
    return true;
  }
  clearActiveExploits() {
    this.exploitsManager.removeExploitsFromPlayer(this.player);
  }
  clearInvetory() {
    this.exploitsManager.removeTriggerFromPlayer(this.player);
    this.items.clear();
  }
}
