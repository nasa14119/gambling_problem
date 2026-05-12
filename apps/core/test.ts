import { Game } from "./Game.ts";
const game = new Game();
game.addPlayer("player:1");
game.addPlayer("player:2");
const facade = game.attachClient("player:1", () => {});
const facade2 = game.attachClient("player:2", console.log);
game.init();
async function waitForTurn() {
  return await new Promise((res) =>
    game.eventManager.on({ eventId: "player:turn", listener: res }, true),
  );
}
const end = new Promise((res) =>
  game.eventManager.on({ eventId: "round:winners", listener: res }, true),
);
facade.handleInput(
  '{"eventId": "player:deposit", "payload": {"chips": 1000 }}',
);
facade2.handleInput(
  '{"eventId": "player:deposit", "payload": {"chips": 1000 }}',
);

let player1Turn = waitForTurn();
facade.handleInput('{"eventId":"round:start"}');
await player1Turn;
let player2Turn = waitForTurn();
facade.handleInput(
  '{"eventId":"player:input", "payload":{"type":"raise", "player":"player:1", "chips":1}}',
);
await player2Turn;
player1Turn = waitForTurn();
facade2.handleInput(
  '{"eventId":"player:input", "payload":{"type":"pay", "player":"player:2", "chips":1}}',
);

await player1Turn;
player2Turn = waitForTurn();
facade.handleInput(
  '{"eventId":"player:input", "payload":{"type":"check", "player":"player:1" , "chips": 0 }}',
);
await player2Turn;
player1Turn = waitForTurn();
facade2.handleInput(
  '{"eventId":"player:input", "payload":{"type":"check", "player":"player:2" , "chips": 0 }}',
);
await player1Turn;

player2Turn = waitForTurn();
facade.handleInput(
  '{"eventId":"player:input", "payload":{"type":"check", "player":"player:1" , "chips": 0 }}',
);
await player2Turn;

player1Turn = waitForTurn();
facade2.handleInput(
  '{"eventId":"player:input", "payload":{"type":"check", "player":"player:2" , "chips": 0 }}',
);
await player1Turn;
player2Turn = waitForTurn();
facade.handleInput(
  '{"eventId":"player:input", "payload":{"type":"check", "player":"player:1" , "chips": 0 }}',
);
await player2Turn;
facade2.handleInput(
  '{"eventId":"player:input", "payload":{"type":"check", "player":"player:2" , "chips": 0 }}',
);
await end;
