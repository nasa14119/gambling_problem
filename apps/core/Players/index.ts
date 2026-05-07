import { type Player } from "./Player";

export class Players {
  players: Map<string, Player> = new Map();
  attachPlayer(player: Player) {
    this.players.set(player.playerId, player);
  }
  detachPlayer(player: Player) {
    this.players.delete(player.playerId);
  }
  session(): Player[] {
    const players = Array.from(this.players, ([_, p]) => p);
    return players;
  }
  getPlayer(id: Player["playerId"]) {
    if (!this.players.has(id)) throw new Error("Player not found");
    return this.players.get(id)!;
  }
  playerTurn(playerTurnId: Player["playerId"]) {
    const player = this.players.get(playerTurnId);
    if (!player) throw new Error("Player not found");
    player.turn();
  }
  getPlaingPlayers() {
    const players = this.session();
    return players.filter((p) => !p.isFold);
  }
  resetForNewRound() {
    for (const key of this.players.keys()) {
      this.players.get(key)!.isFold = false;
    }
  }
}
