const groupSize = {
  5: {
    spies: 2,
    missionSize: [2, 3, 2, 3, 3],
  },
  6: {
    spies: 2,
    missionSize: [2, 3, 4, 3, 4],
  },
  7: {
    spies: 3,
    missionSize: [2, 3, 3, 4, 4],
  },
  8: {
    spies: 3,
    missionSize: [3, 4, 4, 5, 5],
  },
  9: {
    spies: 3,
    missionSize: [3, 4, 4, 5, 5],
  },
  10: {
    spies: 4,
    missionSize: [3, 4, 4, 5, 5],
  },
};

module.exports = class Resistance {
  constructor(users, dedicatedScreen) {
    this.users = users;
    this.winner = null;
    this.numOfPlayers = Object.keys(users).length;
    this.numOfSpies = groupSize[this.numOfPlayers].spies;
    this.res = [];
    this.spies = [];
    this.generateTeams();
    this.missionSize = groupSize[this.numOfPlayers].missionSize;
    this.currentMission = 0;
    this.rejectTracker = 0;
    this.currentLeader = Math.floor(Math.random() * Object.keys(this.users).length);
    this.currentPhase = 'teamSelection';
    this.proposedTeam = [];
    this.voteHistory = [
      [],
      [],
      [],
      [],
      [],
    ];
  }
  generateTeams() {
    const usersCopy = Object.keys(this.users);
    for (let i = 0; i < this.numOfSpies; i++) {
      const randomSpy = Math.floor(Math.random() * usersCopy.length);
      [usersCopy[randomSpy], usersCopy[usersCopy.length - 1]] = [usersCopy[usersCopy.length - 1], usersCopy[randomSpy]];
      this.spies.push(usersCopy.pop());
    }
    this.res.push(...usersCopy);
  }
  getGameState() {
    return {
      users: this.users,
      winner: this.winner,
      res: this.res,
      spies: this.spies,
      currentMission: this.currentMission,
      rejectTracker: this.rejectTracker,
      currentLeader: this.currentLeader,
      currentPhase: this.currentPhase,
      proposedTeam: this.proposedTeam,
      voteHistory: this.voteHistory,
    }
  }

  // move(socketId, payload) {
  //   const {x, y} = payload;
  //   if (socketId !== Object.keys(this.users)[this.turn]) return;
  //   if (!chars.includes(this.gameBoard[y][x])) {
  //     this.gameBoard[y][x] = chars[this.turn];
  //     this.freeSquares--;
  //     if (this.checkWinner()) this.winner = Object.values(this.users)[this.turn];
  //     else if (!this.freeSquares) this.winner = -1;
  //     else this.turn = +!this.turn;
  //   }
  // }

};