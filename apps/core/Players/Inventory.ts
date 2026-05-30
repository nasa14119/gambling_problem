import { ExploitId } from "@repo/types";
import { ExpoitEventManager } from "../Events/ExploitsEventManager.ts";
import { Player } from "./Player.ts";

type InventoryOptions = {
  initialItems?: ExploitId[];
};
export class Inventory {
  private items: Set<ExploitId> = new Set();
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
  includes = (item: ExploitId) => this.items.has(item);
  addItem(item: ExploitId) {
    if (this.includes(item)) throw new Error("Item already exists");
    this.exploitsManager.addTrigger({ exploitId: item, playerId: this.player });
    this.items.add(item);
  }
  getItems() {
    return Array.from(this.items);
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
