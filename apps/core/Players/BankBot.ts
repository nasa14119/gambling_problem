import { BankInterface } from "@repo/types/server";
import { ErrorInTurn } from "../types.ts";

export class Bank implements BankInterface {
  private chips: number = 0;
  constructor(chips: number) {
    this.chips = chips;
  }
  canPay(amount: number) {
    if (this.chips === 0) return false;
    return this.chips - amount > 0;
  }
  getChipsValue() {
    return this.chips;
  }
  getChips(amount: number) {
    if (amount > this.chips)
      throw new ErrorInTurn(
        "Invalid input of chips, can't be gratter than the amount store",
        "INVALID_INPUT",
      );
    if (amount <= 0)
      throw new ErrorInTurn("Value must be grater than 1", "INVALID_INPUT");
    this.chips -= amount;
    return amount;
  }
  getMoneyValue() {
    return 0;
  }
  addChips(amount: number) {
    this.chips += amount;
  }
  setChips(amount: number) {
    this.chips = amount;
  }
}
