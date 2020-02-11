const groupSize = {
  1: {
    // FOR EASIER TESTING. DELETE THIS LATER
    spies: 0,
    missionSize: [1, 1, 1, 1, 1]
  },

  5: {
    spies: 2,
    missionSize: [2, 3, 2, 3, 3]
  },
  6: {
    spies: 2,
    missionSize: [2, 3, 4, 3, 4]
  },
  7: {
    spies: 3,
    missionSize: [2, 3, 3, 4, 4]
  },
  8: {
    spies: 3,
    missionSize: [3, 4, 4, 5, 5]
  },
  9: {
    spies: 3,
    missionSize: [3, 4, 4, 5, 5]
  },
  10: {
    spies: 4,
    missionSize: [3, 4, 4, 5, 5]
  }
};

const resImages = [
  'resistance_char_res1.png',
  'resistance_char_res2.png',
  'resistance_char_res3.png',
  'resistance_char_res4.png',
  // 'resistance_char_res5.png',
  // 'resistance_char_res6.png',
  // 'resistance_char_res7.png',
  // 'resistance_char_res8.png',
  // 'resistance_char_res9.png',
  // 'resistance_char_res10.png',

  'resistance_char_commander.png',
  'resistance_char_bodyguard.png'
];
const spyImages = [
  // 'resistance_char_spy1.png',
  // 'resistance_char_spy2.png',
  // 'resistance_char_spy3.png',
  // 'resistance_char_spy4.png',
  // 'resistance_char_spy5.png',
  // 'resistance_char_spy6.png',
  // 'resistance_char_spy7.png',
  // 'resistance_char_spy8.png',
  // 'resistance_char_spy9.png',
  // 'resistance_char_spy10.png',

  'resistance_char_assassin.png',
  'resistance_char_falsecommander.png',
  'resistance_char_deepcover.png',
  'resistance_char_blindspy.png'
];

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
    this.players = Object.keys(users);
    this.winner = null;
    this.numOfSpies = groupSize[this.players.length].spies;
    this.res = {};
    this.spies = {};
    this.successes = 0;
    this.specialRoles = {};
    this.missionSize = groupSize[this.players.length].missionSize;
    this.currentMission = 0;
    this.rejectTracker = 0;
    this.currentLeader = 0;
    this.failures = 0;
    this.activePlayers = {};
    this.currentPhase = 'teamSelection';
    this.proposedTeam = {};
    this.currentVotes = {};
    this.voteHistory = [[], [], [], [], []];
    this.missionVotes = {};
    this.voting = false;
    this.generateTeams();
  }
  generateTeams() {
    const shuffledPlayers = shuffle(this.players);
    const shuffledResImages = shuffle(resImages);
    const shuffledSpyImages = shuffle(spyImages);
    for (let i = 0; i < shuffledPlayers.length; i++) {
      if (i < this.numOfSpies) {
        this.spies[shuffledPlayers[i]] = shuffledSpyImages[i];
      } else {
        this.res[shuffledPlayers[i]] = shuffledResImages[i - this.numOfSpies];
      }
    }
    this.players = shuffledPlayers;

    this.activePlayers[this.players[0]] = true;
  }
  getGameState() {
    return {
      users: this.users,
      dedicatedScreen: this.dedicatedScreen,
      players: this.players,
      winner: this.winner,
      res: this.res,
      spies: this.spies,
      specialRoles: this.specialRoles,
      currentMission: this.currentMission,
      rejectTracker: this.rejectTracker,
      currentLeader: this.currentLeader,
      currentPhase: this.currentPhase,
      proposedTeam: this.proposedTeam,
      voteHistory: this.voteHistory,
      missionVotes: this.missionVotes,
      activePlayers: this.activePlayers,
      voting: this.voting
    };
  }
  proposeTeam(io, socket, data) {
    const { missionSize } = groupSize[this.players.length];

    if (data.id in this.proposedTeam) delete this.proposedTeam[data.id];
    else if (
      Object.keys(this.proposedTeam).length === missionSize[this.currentMission]
    )
      return;
    else this.proposedTeam[data.id] = true;
    io.in(socket.roomName).emit('proposedTeam', {
      proposedTeam: this.proposedTeam
    });
  }
  startVote(io, socket) {
    const { missionSize } = groupSize[this.players.length];
    if (
      Object.keys(this.proposedTeam).length !== missionSize[this.currentMission]
    )
      return;
    this.voting = true;
    io.in(socket.roomName).emit('setVoteStatus', { voting: true });
  }
  submitVote(io, socket, castedVote) {
    if (socket.id in this.currentVotes) {
      return;
    } else {
      this.currentVotes[socket.id] = castedVote;
    }
    if (
      Object.keys(this.currentVotes).length === this.players.length &&
      this.voting
    ) {
      const tally = Object.values(this.currentVotes).reduce(
        (total, vote) => (total += +vote),
        0
      );
      const passed = tally > this.players.length / 2;
      // const gameState = {};
      this.currentLeader++;
      this.voting = false;
      this.currentVotes = {};
      this.proposedTeam = {};
      io.in(socket.roomName).emit('proposedTeam', {
        proposedTeam: this.proposedTeam
      });
      if (!passed) {
        this.rejectTracker++;
        if (this.rejectTracker === 5) {
          this.gameOver(io, socket, 'reject');
          return;
        }
        // this.proposedTeam = {};
        this.activePlayers = {
          [this.players[this.currentLeader % this.players.length]]: true
        };
        // this.activePlayers[
        //   this.players[this.currentLeader % this.players.length]
        // ] = true;

        // gameState.proposedTeam = this.proposedTeam;
        // gameState.activePlayers = this.activePlayers;
        // gameState.voting = this.voting;
        // io.in(socket.roomName).emit('setVoteStatus', gameState);
      } else {
        this.rejectTracker = 0;
        this.activePlayers = this.proposedTeam;
        this.currentPhase = 'roundStart';
        // io.in(socket.roomName).emit('sendGameState', this.getGameState());
      }
      // this.currentVotes = {};
      io.in(socket.roomName).emit('sendGameState', this.getGameState());
    }
  }

  missionVote(io, socket, castedVote) {
    if (socket.id in this.missionVotes) {
      return;
    }
    this.missionVotes[socket.id] = castedVote;
    const totalVotes = this.missionSize[this.currentMission];
    if (Object.keys(this.missionVotes).length === totalVotes) {
      let tally = 0;
      for (let key in this.missionVotes) {
        if (this.missionVotes[key]) tally++;
      }
      if (tally !== totalVotes) this.failures++;
      else this.successes++;
      if (this.failures === 3) this.gameOver(io, socket, 'spiesWin');
      else if (this.successes === 3) this.gameOver(io, socket, 'resWin');
      this.currentMission++;
      const resultVotes = shuffle(Object.values(this.missionVotes));
    }
  }
  gameOver(io, socket, reason) {
    switch (reason) {
      case 'reject':
        this.winner = 'spies';
        break;
      case 'resWin':
        this.winner = 'res';
        break;
      case 'spiesWin':
        this.winner = 'spies';
        break;
    }
    io.in(socket.roomName).emit('sendGameState', { winner: this.winner });
  }
  // sendActivePlayers (io, socket) {
  //   io.in(socket.roomName).emit('setVoteStatus', { activePlayers: this.activePlayers });
  // }
};
