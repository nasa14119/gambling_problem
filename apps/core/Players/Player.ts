import { PlayerHand } from "@repo/types";
import type { GameEventPayloads } from "../Events/GameEventManager";
import { Bank } from "./Bank";
import { ErrorInTurn, UserInput } from "../types";
import type {
  Player as IPlayer,
  PlayerOptions,
  PlayerConstructor,
} from "./types";
import { Timer } from "../lib/TimerGame";
import { DEFAULTS, VALID_ACTIONS } from "./types";

const PLAYER_TURN_TIME_SECONDS = 60;

export class Player implements IPlayer {
  playerId: string;
  cards: PlayerHand = null;
  isFold = false;
  bank: Bank;
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
    this.manager = manager;
  }
  private async getUserInput() {
    const { promise, resolve, reject } = Promise.withResolvers<UserInput>();
    const id = this.manager.on(
      {
        eventId: "player:input",
        listener: (payload) => {
          resolve(payload);
          time.cancel();
        },
      },
      true,
    );
    const time = new Timer({
      manager: this.manager,
      time: PLAYER_TURN_TIME_SECONDS,
      player: this,
      onEnd: () => {
        const fold: UserInput = {
          player: this,
          type: "fold",
          chips: 0,
        };
        this.manager.emit("player:validbet", fold);
        this.manager.remove("player:input", id);
        reject(new ErrorInTurn("Time exeded", "TIME_EXEDED"));
      },
    });
    return await promise;
  }
  async turn() {
    try {
      // This will have the user input only if valid
      const { type, chips: userInputChips } = await this.getUserInput();
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
      if (type === "TIME_EXEDED") {
        this.manager.emit("player:timeexeded", this);
        return;
      }
      throw new Error("Unexpected error happend getting" + message);
    }
  }
}
