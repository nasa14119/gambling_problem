import { Deck } from ".";
import type { Player } from "../types";
import { test, expect } from "vitest";
import type { Card } from "@repo/types";
test("shuffle", () => {
  const deck = new Deck();
  deck.shuffle();
  expect(deck.cards.length).toBe(52);
  let isUnique = true;
  const cache = new Set();
  for (let i = 0; i < deck.cards.length; i++) {
    if (cache.has(deck.cards[i])) {
      isUnique = false;
      break;
    }
    cache.add(deck.cards[i]);
  }
  expect(isUnique).toBe(true);
});

test("Throws if missing flush", () => {
  const deck = new Deck();
  deck.shuffle();
  expect(deck.turn).toThrow();
});

test("Player turns", () => {
  const deck = new Deck();
  const cards = deck.playerTurn();
  expect(deck.gameState).toStrictEqual([]);
  expect(cards.length).toBe(2);
  expect(deck.position).toBe(2);
});
test("Cicle", () => {
  const deck = new Deck();
  deck.flush();
  expect(deck.gameState.length).toBe(3);
  deck.turn();
  expect(deck.gameState.length).toBe(4);
  deck.river();
  expect(deck.gameState.length).toBe(5);
});

test("History", () => {
  const deck = new Deck();
  const player = deck.playerTurn();
  deck.flush();
  deck.turn();
  const game = deck.river();
  expect(deck.history.size).toBe(5);
  expect(game.length).toBe(5);
  expect(deck.position).toBe(7);
  expect(player.filter((c) => !deck.history.has(c))).toStrictEqual(player);
  expect(game.filter((c) => deck.history.has(c))).toStrictEqual(game);
});
const fourOfKind: Card[] = ["As", "Ah", "Ac", "Ad", "4c"];

test("Determine winner", () => {
  const deck = new Deck();
  deck.gameState = fourOfKind;
  const playerWinner: Player = { playerId: "1", cards: ["DA", "D2"] };
  const playerLoser: Player = { playerId: "2", cards: ["C8", "D4"] };
  deck.gameState = [...fourOfKind];
  deck.gameState[3] = "H8";
  expect(deck.gameState).toStrictEqual(["SA", "HA", "CA", "H8", "C4"]);

  expect(deck.determineWinner([playerWinner, playerLoser])).toStrictEqual(
    playerWinner,
  );
  playerWinner.cards[0] = "S6";
  expect(playerWinner.cards).toStrictEqual(["S6", "D2"]);
  expect(deck.determineWinner([playerWinner, playerLoser])).toStrictEqual(
    playerLoser,
  );
});
