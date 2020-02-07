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

const shuffle = arr => {
  const output = [...arr];
  for (let i = output.length - 1; i > 0; i--) {
    const randomIdx = Math.floor(Math.random() * (i + 1));
    [output[randomIdx], output[i]] = [output[i], output[randomIdx]];
  }
  return output;
};

module.exports = class Resistance {
  constructor(users, dedicatedScreen) {
    this.users = users;
    this.dedicatedScreen = dedicatedScreen;
    this.players = shuffle(Object.keys(users));
    this.winner = null;
    this.numOfSpies = groupSize[this.players.length].spies;
    this.res = [];
    this.spies = [];
    this.generateTeams();
    this.missionSize = groupSize[this.players.length].missionSize;
    this.currentMission = 0;
    this.rejectTracker = 0;
    this.currentLeader = 0;
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
    const shuffledPlayers = shuffle(this.players);
    this.spies.push(...shuffledPlayers.slice(0, this.numOfSpies));
    this.res.push(...shuffledPlayers.slice(this.numOfSpies));
  }
  getGameState() {
    return {
      users: this.users,
      dedicatedScreen: this.dedicatedScreen,
      players: this.players,
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