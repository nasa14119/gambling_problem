export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function fail<E>(error: E): Result<never, E> {
  return { success: false, error };
}
export type Suit = "c" | "d" | "h" | "s";
export type Num =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "T"
  | "J"
  | "Q"
  | "K"
  | "A";
export type Card = `${Num}${Suit}`;
export type PlayerHand = [Card, Card] | null;
export type Player = {
  playerId: string;
  cards: PlayerHand;
};
export type TurnOptions = "fold" | "raise" | "pay";
