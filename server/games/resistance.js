const teamSize = {
  5: {res: 3, spies: 2},
  6: {res: 4, spies: 2},
  7: {res: 4, spies: 3},
  8: {res: 5, spies: 3},
  9: {res: 6, spies: 3},
  10: {res: 6, spies: 4},
};

module.exports = class Resistance {
  constructor(users, dedicatedScreen) {
    this.users = users;
    this.winner = null;
    this.res = [];
    this.spies = [];
    this.generateTeams();
  }
  getGameState() {
    return {
      res: this.res,
      spies: this.spies,
      winner: this.winner,
    }
  }
  move(socketId, payload) {
    // const {x, y} = payload;
    // if (socketId !== Object.keys(this.users)[this.turn]) return;
    // if (!chars.includes(this.gameBoard[y][x])) {
    //   this.gameBoard[y][x] = chars[this.turn];
    //   this.freeSquares--;
    //   if (this.checkWinner()) this.winner = Object.values(this.users)[this.turn];
    //   else if (!this.freeSquares) this.winner = -1;
    //   else this.turn = +!this.turn;
    // }
  }
  generateTeams() {
    const usersCopy = Object.keys(this.users);
    for (let i = 0; i < teamSize[Object.keys(this.users).length].spies; i++) {
      const randomSpy = Math.floor(Math.random() * usersCopy.length);
      [usersCopy[randomSpy], usersCopy[usersCopy.length - 1]] = [usersCopy[usersCopy.length - 1], usersCopy[randomSpy]];
      this.spies.push(usersCopy.pop());
    }
    this.res.push(...usersCopy);
  }

};