import { ErrorInTurn } from "../types";

export class Bank {
  money: number = 0;
  chips: number = 0;
  constructor(money: number, chips: number) {
    this.money = money;
    this.chips = chips;
  }
  deposit(amount: number) {
    if (amount > this.money || amount <= 0)
      throw new ErrorInTurn("Value is not allow", "INVALID_INPUT");
    this.money -= amount;
    this.chips += amount;
  }
  withdraw(amount: number) {
    if (amount > this.chips || amount <= 0)
      throw new ErrorInTurn("Value is not allow", "INVALID_INPUT");
    this.chips -= amount;
    this.money += amount;
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
  addChips(amount: number) {
    this.chips = amount;
  }
}
