module.exports = class TicTac {
  constructor(users, host, hostIsPlayer) {
    // hostIsPlayer = false;        // test code for now: force hostIsPlayer to false
    this.players = hostIsPlayer ? users : users.filter(user => user !== host);
    this.winner = null;
    this.gameBoard = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    this.turn = 0;
    this.char = ['X', '0'];
  }
  getGameState() {
    return { gameBoard: this.gameBoard, winner: this.winner };
  }
  move(id, x, y) {
    if (id !== this.players[this.turn]) return;
    if (this.gameBoard[x][y] === ' ') {
      this.gameBoard[x][y] = this.char[this.turn];
      let res = this.checkWinner(this.char[this.turn]);
      if (res) this.winner = this.players[this.turn];
      if (this.turn === 0) this.turn = 1;
      else this.turn = 0;
    }
    return;
    // return { gameBoard: this.gameBoard, winner: this.winner };
  }
  checkWinner(char) {
    let game = this.gameBoard;
    for (let i = 0; i < game.length; i++) {
      for (let j = 0; j < game[i].length; j++) {
        if (game[i][j] !== char) break;
        else if (game[i][j] === char && j === 2) return true;
      }
    }
    for (let i = 0; i < game.length; i++) {
      for (let j = 0; j < game[i].length; j++) {
        if (game[j][i] !== char) break;
        else if (game[i][j] === char && j === 2) return true;
      }
    }
    let diag =
      game[1][1] === char && game[0][0] === char && char === game[2][2];

    let diag2 =
      game[2][0] === char && game[0][0] === char && char === game[0][2];
    return diag || diag2;
  }
};
