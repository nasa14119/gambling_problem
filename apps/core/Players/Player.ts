import { PlayerHand, TurnOptions } from "@repo/types";
import type { GameEventPayloads } from "../Events/GameEventManager";
import { Bank } from "./Bank";
import { ErrorInTurn } from "../types";
import type {
  Player as IPlayer,
  PlayerOptions,
  PlayerConstructor,
} from "./types";
import { DEFAULTS, VALID_ACTIONS } from "./types";
const PLAYER_TURN_TIME_MILISECONDS = 30 * 1000;
type UserInput = {
  type: TurnOptions;
  player: Player;
  chips: number;
};
export class Player implements IPlayer {
  playerId: string;
  cards: PlayerHand = null;
  isFold = false;
  bank: Bank;
  private removeListener: PlayerConstructor["manager"]["remove"];
  private sendInput: (payload: GameEventPayloads["player:validbet"]) => void;
  private manager: PlayerConstructor["manager"];
  constructor(
    { playerId, manager }: PlayerConstructor,
    options?: PlayerOptions,
  ) {
    this.playerId = playerId;
    const { money, chips } = { ...DEFAULTS, ...options };
    this.bank = new Bank(money, chips);
    this.sendInput = manager.getEmiter("player:validbet");
    this.removeListener = manager.remove.bind(manager);
    this.manager = manager;
  }
  async turn() {
    const {
      promise: userInpPromise,
      resolve: valueFun,
      reject: cancelTurn,
    } = Promise.withResolvers<UserInput>();
    let timeOutId: number;
    let id: string;
    // This function will only run if time is exeded
    const handleTimeExeded = () => {
      this.sendInput({
        chips: 0,
        player: this,
        type: "fold",
      });
      this.removeListener("player:input", id);
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
        this.sendInput({ type, chips: 0, player: this });
        return;
      }
      // This will check that the user has the chips he whants to bet
      const chips = this.bank.getChips(userInputChips);
      this.sendInput({ type, chips, player: this });
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
