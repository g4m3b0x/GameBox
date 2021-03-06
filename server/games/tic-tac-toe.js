const chars = ['X', 'O'];

module.exports = class TicTacToe {
  constructor(users, dedicatedScreen) {
    this.users = users;
    this.dedicatedScreen = dedicatedScreen;
    this.winner = null;
    this.gameBoard = [
      ['‏‏‎ ‎', '‏‏‎ ‎', '‏‏‎ ‎'],
      ['‏‏‎ ‎', '‏‏‎ ‎', '‏‏‎ ‎'],
      ['‏‏‎ ‎', '‏‏‎ ‎', '‏‏‎ ‎'],
    ];
    this.freeSquares = 9;
    this.turn = Math.floor(Math.random() * 2);
  }
  getGameState(socket, io) {
    const gameState = {
      users: this.users,
      dedicatedScreen: this.dedicatedScreen,
      gameBoard: this.gameBoard,
      turn: this.turn,
      winner: this.winner
    };
    io.in(socket.roomName).emit('sendGameState', gameState);
  }
  writeGameState(socket, io, data) {
    const { request, payload } = data;
    const gameState = {};
    switch (request) {
      case 'sendMove':
        this.move(socket.id, payload);
        gameState.gameBoard = this.gameBoard;
        gameState.turn = this.turn;
        gameState.winner = this.winner;
        break;
    }
    io.in(socket.roomName).emit('sendGameState', gameState);
  }
  move(socketId, payload) {
    const {x, y} = payload;
    if (socketId !== Object.keys(this.users)[this.turn]) return;
    if (!chars.includes(this.gameBoard[y][x])) {
      this.gameBoard[y][x] = chars[this.turn];
      this.freeSquares--;
      if (this.checkWinner()) this.winner = Object.values(this.users)[this.turn];
      else if (!this.freeSquares) this.winner = -1;
      else this.turn = +!this.turn;
    }
  }
  checkWinner() {
    const char = chars[this.turn];
    const checkRows = () => {
      for (let row = 0; row < 3; row++) {
        if (this.gameBoard[row].every(c => c === char)) return true;
      }
      return false;
    }
    const checkCols = () => {
      for (let col = 0; col < 3; col++) {
        if (
          this.gameBoard[0][col] === char
          && this.gameBoard[1][col] === char
          && this.gameBoard[2][col] === char
        ) return true;
      }
      return false;
    }
    const checkFwDiag = () => {
      for (let i = 0; i < 3; i++) {
        if (this.gameBoard[i][2 - i] !== char) return false;
      }
      return true;
    }
    const checkBkDiag = () => {
      for (let i = 0; i < 3; i++) {
        if (this.gameBoard[i][i] !== char) return false;
      }
      return true;
    }
    return checkRows() || checkCols() || checkFwDiag() || checkBkDiag();
  }
};
