import { BankData, User } from "@repo/types/server";
import { getQuerryRank } from "db";
import type { Game } from "../Game.ts";
import { BackBettting } from "./types.ts";

type MafiaData = Pick<BankData, "round_to_end" | "pay" | "credit">;
export class Mafia {
  private game: Game;
  private events: Game["eventManager"];
  private player: User;
  private havePay: boolean = false;
  private backBettin: BackBettting = null;
  private playerPay: number = 0;
  private playerCredit: number = 0;
  private roundToEnd: number = 0;
  private roundPassed: number = 0;
  constructor(game: Game, player: User) {
    this.game = game;
    this.player = player;
    this.getNextDebt();
    this.events = this.game.eventManager;
    this.events.on({
      eventId: "round:end",
      listener: ({ round }) => {
        if (this.player.bank.isBackrupt()) {
          this.events.emit("reset:hard", {
            end: "BANKRUPT",
            player: this.player.playerId,
          });
          return;
        }
        this.roundPassed = round;
        this.updateMafia();
      },
    });
    this.events.on({
      eventId: "round:winners",
      listener: ({ winners, moneyWin }) => {
        if (this.backBettin === null) return;
        const haveWin = winners.some(
          (w) => w.player.playerId === this.player.playerId,
        );
        this.backBettin.round--;
        this.backBet(haveWin, moneyWin);
      },
    });
    this.events.on({
      eventId: "mafia:pay",
      listener: ({ money, player }) => {
        if (player !== this.player.playerId) return;
        this.payDebt(money);
      },
    });
  }
  private payDebt(money: number) {
    if (this.havePay) return;
    if (!this.player.bank.canPayMoney(money)) {
      this.events.emit("player:insuficientfunds", {
        min: money,
        player: this.player,
      });
      return;
    }
    if (this.playerCredit < money) {
      money = this.playerCredit - this.playerPay;
    }
    this.player.bank.pay(money);
    this.playerPay += money;
    if (this.playerPay === this.playerCredit) {
      this.havePay = true;
    }
  }
  private backBet(win: boolean, pot: number) {
    if (this.backBettin === null) return;
    if (this.backBettin.round <= 0) {
      this.backBettin = null;
      this.events.emit("mafia:backbet_end", { player: this.player.playerId });
      return;
    }
    const factor = this.backBettin.factor * (win ? 1 : -1);
    this.player.bank.addMoney(factor * pot);
    this.events.emit("mafia:backbet_update", { player: this.player });
  }
  private async updateMafia() {
    if (this.havePay) return;
    if (this.roundPassed < this.roundToEnd) return;
    this.events.emit("reset:hard", {
      end: "DEATH",
      player: this.player.playerId,
    });
  }
  private async getNextDebt() {
    const data = await getQuerryRank();
    if (!data) {
      this.havePay = true;
      return;
    }
    const { credit, rounds } = data;
    this.playerCredit = credit;
    this.roundToEnd = rounds;
    this.havePay = false;
  }
  getMafiaData(): MafiaData {
    return {
      credit: this.playerCredit,
      round_to_end: this.roundToEnd - this.roundPassed,
      pay: this.playerPay,
    };
  }
}
