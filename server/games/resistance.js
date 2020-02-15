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
  'resistance_char_res5.png',
  'resistance_char_res6.png',
  'resistance_char_res7.png',
  'resistance_char_res8.png',
  'resistance_char_res9.png',
  'resistance_char_res10.png'

  // 'resistance_char_commander.png',
  // 'resistance_char_bodyguard.png'
];
const spyImages = [
  'resistance_char_spy1.png',
  'resistance_char_spy2.png',
  'resistance_char_spy3.png',
  'resistance_char_spy4.png',
  'resistance_char_spy5.png',
  'resistance_char_spy6.png',
  'resistance_char_spy7.png',
  'resistance_char_spy8.png',
  'resistance_char_spy9.png',
  'resistance_char_spy10.png'

  // 'resistance_char_assassin.png',
  // 'resistance_char_falsecommander.png',
  // 'resistance_char_deepcover.png',
  // 'resistance_char_blindspy.png'
];
const gunImages = [
  'resistance_token_gun1.png',
  'resistance_token_gun2.png',
  'resistance_token_gun3.png',
  'resistance_token_gun4.png',
  'resistance_token_gun5.png'
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
    this.specialRoles = {
      commander: '',
      assassin: '',
      bodyguard: '',
      falseCommander: '',
      deepCover: '',
      blindSpy: ''
    };
    this.missionSize = groupSize[this.players.length].missionSize;
    this.currentMission = 0;
    this.rejectTracker = 0;
    this.currentLeader = 0;
    this.currentPhase = 'teamSelection';
    this.voting = false;
    this.proposedTeam = {};
    this.gunImages = gunImages;
    this.teamVotes = {};
    this.voteHistory = [[], [], [], [], []];
    this.missionVotes = {};
    this.resultOfVotes = [];
    this.missionResults = [];
    this.generateTeams();
  }
  generateTeams() {
    const shuffledPlayers = shuffle(this.players);
    const shuffledResImages = shuffle(resImages);
    const shuffledSpyImages = shuffle(spyImages);
    for (let i = 0; i < shuffledPlayers.length; i++) {
      if (i < this.numOfSpies) {
        this.spies[shuffledPlayers[i]] = shuffledSpyImages[i];

        // **********FOR TESTING (REMOVE LATER):
        const TEST_SPY_IMAGES = {
          0: 'resistance_char_assassin.png',
          1: 'resistance_char_falsecommander.png',
          2: 'resistance_char_deepcover.png',
          3: 'resistance_char_blindspy.png'
        };
        const TEST_SPY_TITLES = {
          0: 'assassin',
          1: 'falseCommander',
          2: 'deepCover',
          3: 'blindSpy'
        };
        if (this.players.length === 10) {
          this.spies[shuffledPlayers[i]] = TEST_SPY_IMAGES[i];
          this.specialRoles[TEST_SPY_TITLES[i]] = shuffledPlayers[i];
        }
        // **********
      } else {
        this.res[shuffledPlayers[i]] = shuffledResImages[i - this.numOfSpies];

        // **********FOR TESTING (REMOVE LATER):
        const TEST_RES_IMAGES = {
          4: 'resistance_char_commander.png',
          5: 'resistance_char_bodyguard.png'
        };
        const TEST_RES_TITLES = {
          4: 'commander',
          5: 'bodyguard'
        };
        if (this.players.length === 10 && i < 6) {
          this.res[shuffledPlayers[i]] = TEST_RES_IMAGES[i];
          this.specialRoles[TEST_RES_TITLES[i]] = shuffledPlayers[i];
        }
        // **********
      }
    }
    this.players = shuffle(shuffledPlayers);
  }
  getGameState() {
    return {
      groupSize,
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
      voting: this.voting,
      proposedTeam: this.proposedTeam,
      teamVotes: this.teamVotes,
      voteHistory: this.voteHistory,
      missionVotes: this.missionVotes,
      resultOfVotes: this.resultOfVotes,
      missionResults: this.missionResults,
    };
  }
  proposeTeam(io, socket, player) {
    const { missionSize } = groupSize[this.players.length];

    if (!Object.keys(this.proposedTeam).length) {
      this.gunImages = shuffle(this.gunImages);
    }
    if (player.id in this.proposedTeam) {
      this.gunImages.push(this.proposedTeam[player.id]);
      delete this.proposedTeam[player.id];
    } else if (
      Object.keys(this.proposedTeam).length === missionSize[this.currentMission]
    ) {
      return;
    } else {
      this.proposedTeam[player.id] = this.gunImages.pop();
    }
    io.in(socket.roomName).emit('proposedTeam', {
      proposedTeam: this.proposedTeam
    });
  }
  startTeamVote(io, socket) {
    const { missionSize } = groupSize[this.players.length];
    if (
      Object.keys(this.proposedTeam).length !== missionSize[this.currentMission]
    )
      return;
    this.voting = true;
    io.in(socket.roomName).emit('setVoteStatus', { voting: true });
  }
  submitTeamVote(io, socket, castedVote) {
    if (socket.id in this.teamVotes) {
      return;
    } else {
      this.teamVotes[socket.id] = castedVote;
      io.in(socket.roomName).emit('updateTeamVote', {
        socketId: socket.id,
        castedVote
      });
    }
    if (
      Object.keys(this.teamVotes).length === this.players.length &&
      this.voting
    ) {
      const tally = Object.values(this.teamVotes).reduce(
        (total, vote) => (total += +vote), 0
      );
      const passed = tally > this.players.length / 2;
      // const gameState = {};
      this.voting = false;
      this.teamVotes = {};
      // this.currentPhase = 'teamSelectionReveal';
      // io.in(socket.roomName).emit('sendGameState', this.getGameState());
      if (!passed) {
        this.rejectTracker++;
        if (this.rejectTracker === 5) {
          this.gameOver(io, socket, 'reject');
          return;
        }
        this.nextVote();
      } else {
        this.rejectTracker = 0;
      }
      setTimeout(() => {
        this.currentPhase = passed ? 'roundStart' : 'teamSelection';
        io.in(socket.roomName).emit('sendGameState', this.getGameState());
      }, 1);
    }
  }
  nextVote() {
    this.currentLeader = (this.currentLeader + 1) % this.players.length;
    this.currentPhase = 'teamSelection';
    this.missionVotes = {};
    this.proposedTeam = {};
    this.gunImages = gunImages;
  }
  submitMissionVote(io, socket, castedVote) {
    if (socket.id in this.missionVotes) {
      return;
    } else {
      this.missionVotes[socket.id] = castedVote;
      io.in(socket.roomName).emit('updateMissionVote', {
        socketId: socket.id,
        castedVote
      });
    }
    const totalVotes = this.missionSize[this.currentMission];
    if (Object.keys(this.missionVotes).length === totalVotes) {
      const tally = Object.values(this.missionVotes).reduce(
        (total, vote) => (total += +vote), 0
      );
      if (
        ((this.players.length < 7 || this.currentMission !== 3) && totalVotes - tally >= 1)
        || totalVotes - tally >= 2
      ) {
        this.missionResults.push(0);
      } else {
        this.missionResults.push(1);
      }
      if (this.missionResults.reduce((failures, mission) => mission ? failures : failures + 1, 0) === 3) {
        this.gameOver(io, socket, 'spiesWin');
        return;
      }
      if (this.missionResults.reduce((successes, mission) => mission ? successes + 1 : successes, 0) === 3) {
        if (!this.specialRoles.assassin) {
          this.gameOver(io, socket, 'resWin');
        } else {
          this.currentPhase = 'assassination';    // write code for assassination later!
        }
        return;
      }
      this.currentMission++;
      this.resultOfVotes = shuffle(Object.values(this.missionVotes));
      this.nextVote();
      io.in(socket.roomName).emit('sendGameState', this.getGameState());
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
    // io.in(socket.roomName).emit('sendGameState', { winner: this.winner });
    io.in(socket.roomName).emit('sendGameState', this.getGameState());
  }
};
