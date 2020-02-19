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

const resImages = Array(10).fill(0).map((_, i) => `resistance_char_res${i + 1}.png`);
const spyImages = Array(10).fill(0).map((_, i) => `resistance_char_spy${i + 1}.png`);
const gunImages = Array(5).fill(0).map((_, i) => `resistance_token_gun${i + 1}.png`);

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
    this.groupSize = groupSize[Object.keys(users).length];
    this.users = users;
    this.dedicatedScreen = dedicatedScreen;
    this.players = Object.keys(users);
    this.winner = null;
    this.numOfSpies = this.groupSize.spies;
    this.res = {};
    this.spies = {};
    this.specialRoles = {
      commander: false,
      assassin: false,
      bodyguard: false,
      falseCommander: false,
      deepCover: false,
      blindSpy: false
    };
    this.currentMission = 0;
    this.rejectTracker = 0;
    this.currentLeader = 0;
    this.currentPhase = 'chooseRoles';
    this.voting = false;
    this.proposedTeam = {};
    this.gunImages = gunImages;
    this.teamVotes = {};
    // this.voteHistory = [[], [], [], [], []];
    this.missionVotes = {};
    this.resultOfVotes = [];
    this.missionResults = [null, null, null, null, null];
  }
  getGameState() {
    return {
      groupSize: this.groupSize,
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
      // voteHistory: this.voteHistory,
      missionVotes: this.missionVotes,
      resultOfVotes: this.resultOfVotes,
      missionResults: this.missionResults,
    };
  }
  startGame(io, socket) {
    const shuffledPlayers = shuffle(this.players);
    const shuffledResImages = shuffle(resImages);
    const shuffledSpyImages = shuffle(spyImages);
    for (let i = 0; i < shuffledPlayers.length; i++) {
      const currentPlayer = shuffledPlayers[i];
      if (i < this.numOfSpies) {
        if (this.specialRoles.assassin === true) {
          this.specialRoles.assassin = currentPlayer;
          this.spies[currentPlayer] = 'resistance_char_assassin.png';
        } else if (this.specialRoles.falseCommander === true) {
          this.specialRoles.falseCommander = currentPlayer;
          this.spies[currentPlayer] = 'resistance_char_falseCommander.png';
        } else if (this.specialRoles.deepCover === true) {
          this.specialRoles.deepCover = currentPlayer;
          this.spies[currentPlayer] = 'resistance_char_deepCover.png';
        } else if (this.specialRoles.blindSpy === true) {
          this.specialRoles.blindSpy = currentPlayer;
          this.spies[currentPlayer] = 'resistance_char_blindSpy.png';
        } else {
          this.spies[currentPlayer] = shuffledSpyImages[i];
        }
      } else {

        if (this.specialRoles.commander === true) {
          this.specialRoles.commander = currentPlayer;
          this.res[currentPlayer] = 'resistance_char_commander.png';
        } else if (this.specialRoles.bodyguard === true) {
          this.specialRoles.bodyguard = currentPlayer;
          this.res[currentPlayer] = 'resistance_char_bodyguard.png';
        } else {
          this.res[currentPlayer] = shuffledResImages[i - this.numOfSpies];
        }
      }
    }
    this.players = shuffle(shuffledPlayers);
    this.currentPhase = 'teamSelection';
    io.in(socket.roomName).emit('sendGameState', this.getGameState());
  }
  toggleRole(io, socket, role) {
    this.specialRoles[role] = !this.specialRoles[role];
    io.in(socket.roomName).emit('sendGameState', this.specialRoles);
  }
  proposeTeam(io, socket, player) {
    if (!Object.keys(this.proposedTeam).length) {
      this.gunImages = shuffle(this.gunImages);
    }
    if (player.id in this.proposedTeam) {
      this.gunImages.push(this.proposedTeam[player.id]);
      delete this.proposedTeam[player.id];
    } else if (
      Object.keys(this.proposedTeam).length === this.groupSize.missionSize[this.currentMission]
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
    if (
      Object.keys(this.proposedTeam).length !== this.groupSize.missionSize[this.currentMission]
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
      if (!passed) {
        this.rejectTracker++;
      } else {
        this.rejectTracker = 0;
        this.voting = false;
      }
      this.currentPhase = 'voteReveal';
      io.in(socket.roomName).emit('sendGameState', this.getGameState());
      if (this.rejectTracker === 5) {
        this.gameOver(io, socket, 'reject');
        return;
      }
    }
  }
  completeVoteReveal(io, socket) {
    if (this.voting) {
      this.voting = false;
      this.nextVote();
    } else {
      this.currentPhase = 'mission';
    }
    this.teamVotes = {};
    io.in(socket.roomName).emit('sendGameState', this.getGameState());
  }
  nextVote() {
    this.currentLeader = (this.currentLeader + 1) % this.players.length;
    this.currentPhase = 'teamSelection';
    this.missionVotes = {};
    this.proposedTeam = {};
    this.gunImages = gunImages;
  }
  submitMissionVote(io, socket, castedVote) {
    this.missionVotes[socket.id] = castedVote;
    io.in(socket.roomName).emit('updateMissionVote', {
      socketId: socket.id,
      castedVote
    });
    const totalVotes = this.groupSize.missionSize[this.currentMission];
    if (Object.keys(this.missionVotes).length === totalVotes) {
      const tally = Object.values(this.missionVotes).reduce(
        (total, vote) => (total += +vote), 0
      );
      if (
        ((this.players.length < 7 || this.currentMission !== 3) && totalVotes - tally >= 1)
        || totalVotes - tally >= 2
      ) {
        this.missionResults[this.currentMission] = 0;
      } else {
        this.missionResults[this.currentMission] = 1;
      }
      this.currentPhase = 'missionReveal';
      this.resultOfVotes = shuffle(Object.values(this.missionVotes));
      io.in(socket.roomName).emit('sendGameState', this.getGameState());

      if (this.missionResults.reduce((failures, mission) => mission === 0 ? failures + 1 : failures, 0) === 3) {
        this.gameOver(io, socket, 'spiesWin');
        return;
      }
      if (this.missionResults.reduce((successes, mission) => mission === 1 ? successes + 1 : successes, 0) === 3) {
        // if (!this.specialRoles.assassin) {
          this.gameOver(io, socket, 'resWin');
        // } else {
          this.currentPhase = 'assassination';    // write code for assassination later!
        // }
        return;
      }

    }
  }
  completeMissionReveal(io, socket) {
    this.resultOfVotes = [];
    this.currentMission++;
    this.nextVote();
    io.in(socket.roomName).emit('sendGameState', this.getGameState());
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
