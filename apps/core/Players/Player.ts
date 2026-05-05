import { PlayerHand, TurnOptions } from "@repo/types";
import { type GameEventManagerType } from "../Events/GameEventManager";
import { Bank } from "../Bank";
import { ErrorInTurn } from "../types";
const PLAYER_TURN_TIME_MILISECONDS = 30 * 1000;
type UserInput = {
  type: TurnOptions;
  player: Player;
  chips: number;
};
const VALID_ACTIONS = new Set(["fold", "raise", "pay"]);
export class Player {
  playerId: string;
  manager!: ReturnType<GameEventManagerType["createManage"]>;
  cards: PlayerHand;
  bank = new Bank(1000, 100);
  constructor(playerId: string) {
    this.playerId = playerId;
    this.cards = null;
  }
  isFold = false;
  async turn() {
    const {
      promise: userInpPromise,
      resolve: valueFun,
      reject: cancelTurn,
    } = Promise.withResolvers<UserInput>();
    const sendInput = this.manager.getEmiter("player:validbet");
    let timeOutId: number;
    let id: string;
    // This function will only run if time is exeded
    const handleTimeExeded = () => {
      this.manager.emit("player:input", {
        chips: 0,
        player: this,
        type: "fold",
      });
      this.manager.remove("player:input", id);
      cancelTurn(new ErrorInTurn("Time exeded", "TIME_EXEDED"));
    };
    timeOutId = setTimeout(handleTimeExeded, PLAYER_TURN_TIME_MILISECONDS);
    // this function will be envoke if the event of player input is got
    const handleInput = (args: UserInput) => {
      clearTimeout(timeOutId);
      valueFun(args);
    };
    id = this.manager.on(
      { eventId: "player:input", listener: handleInput },
      true,
    );
    try {
      // This will have the user input only if valid
      const { type, chips: userInputChips } = await userInpPromise;
      if (!VALID_ACTIONS.has(type))
        throw new ErrorInTurn("Invalid action", "INVALID_INPUT");
      if (type === "fold") {
        sendInput({ type, chips: 0, player: this });
        return;
      }
      // This will check that the user has the chips he whants to bet
      const chips = this.bank.getChips(userInputChips);
      sendInput({ type, chips, player: this });
    } catch (e) {
      const { type, message } = e as ErrorInTurn;
      if (type === "INVALID_INPUT") {
        this.manager.emit("player:invalid_input", {
          error: message,
          player: this,
        });
        this.manager.emit("player:turn", this.playerId);
        return;
      }
      if (type == "TIME_EXEDED") {
        this.manager.emit("player:timeexeded", this);
        return;
      }
      throw new Error("Unexpected error happend getting" + message);
    }
  }
}
