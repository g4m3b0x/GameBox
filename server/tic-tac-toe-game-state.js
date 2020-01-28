export default class TicTac {
  constructor(users) {
    this.users = users;
    this.winner = null;
    this.gameState = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    this.turn = 0;
    this.char = ['X', '0'];
  }
  getGameState() {
    return this.gameState;
  }
  move(id, x, y) {
    if (id !== this.users[this.turn]) return this.gameState;
    if (this.gameState[x][y] === ' ') {
      this.gameState[x][y] = this.char[this.turn];
      if (this.turn === 0) this.turn = 1;
      else this.turn = 0;
    }
    return this.gameState;
  }
}
