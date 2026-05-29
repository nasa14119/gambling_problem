import { ExpoitEventManager } from "../Events/ExploitsEventManager.ts";
import { ErrorInTurn, ExploitBuyPayload } from "../types.ts";
import { Inventory } from "./Inventory.ts";
import { Player } from "./Player.ts";

export interface BankInterface {
  getChipsValue(): number;
  getMoneyValue(): number;
  canPay(amount: number): boolean;
  addChips(amout: number): void;
}
export class Bank implements BankInterface {
  private money: number = 0;
  private chips: number = 0;
  private currentPot: number | null = null;
  private playerInvetory: Inventory;
  constructor(
    money: number,
    chips: number,
    private player: Player,
  ) {
    this.money = money;
    this.chips = chips;
    this.playerInvetory = player.invetory;
  }
  deposit(amount: number) {
    if (amount > this.money || amount <= 0)
      throw new ErrorInTurn("Value is not allow", "INVALID_INPUT");
    this.money -= amount;
    this.chips += amount;
  }
  getCurrentPot() {
    return this.currentPot;
  }
  clearCurrentPot() {
    this.currentPot = null;
  }
  withdraw(amount: number) {
    if (amount > this.chips || amount <= 0)
      throw new ErrorInTurn("Value is not allow", "INVALID_INPUT");
    this.chips -= amount;
    this.money += amount;
  }
  buyExploit({
    exploitId,
    price,
    emit,
  }: Omit<ExploitBuyPayload, "playerId"> & {
    emit: ExpoitEventManager["emit"];
  }) {
    if (this.playerInvetory.includes(exploitId)) {
      emit("buy:error", {
        playerId: this.player.playerId,
        error: "Already bought",
        exploit: exploitId,
      });
      return;
    }
    if (this.money < price) {
      emit("buy:error", {
        playerId: this.player.playerId,
        error: "Insuficient money",
        exploit: exploitId,
      });
      return;
    }
    this.money -= price;
    this.playerInvetory.addItem(exploitId);
    emit("buy:success", {
      playerId: this.player.playerId,
      exploitId,
      newBalance: this.getMoneyValue(),
    });
  }
  canPay(amount: number) {
    if (this.chips === 0) return false;
    return this.chips - amount >= 0;
  }
  canPayMoney(amount: number) {
    if (this.money === 0) return false;
    return this.money - amount >= 0;
  }
  pay(amount: number) {
    if (amount > this.money)
      throw new ErrorInTurn("Invalid input", "INVALID_INPUT");
    this.money -= amount;
    return amount;
  }
  getMoneyValue() {
    return this.money;
  }
  getChipsValue() {
    return this.chips;
  }
  clearChips() {
    this.chips = 0;
  }
  getChips(amount: number) {
    if (amount > this.chips)
      throw new ErrorInTurn(
        "Invalid input of chips, can't be gratter than the amount store",
        "INVALID_INPUT",
      );
    if (amount <= 0)
      throw new ErrorInTurn("Value must be grater than 1", "INVALID_INPUT");
    this.currentPot = (this.currentPot ?? 0) + amount;
    this.chips -= amount;
    return amount;
  }
  addChips(amount: number) {
    this.chips += amount;
  }
  addMoney(amount: number) {
    this.money += amount;
  }
  isBackrupt() {
    return this.chips <= 0 && this.money <= 0;
  }
}
