const groupSize = {
  // -----1 PLAYER IS FOR EASIER TESTING. DELETE THIS LATER
  1: {
    spies: 0,
    missionSize: [1, 1, 1, 1, 1]
  },
  // -----

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

const resImages = Array(10)
  .fill(0)
  .map((_, i) => `resistance_char_res${i + 1}.png`);
const spyImages = Array(10)
  .fill(0)
  .map((_, i) => `resistance_char_spy${i + 1}.png`);
const gunImages = Array(5)
  .fill(0)
  .map((_, i) => `resistance_token_gun${i + 1}.png`);

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
    this.missionVotes = {};
    this.resultOfVotes = [];
    this.missionResults = [null, null, null, null, null];
    this.assassinated = null;
  }
  getGameState(socket, io) {
    const gameState = {};
    gameState.groupSize = this.groupSize;
    gameState.users = this.users;
    gameState.dedicatedScreen = this.dedicatedScreen;
    gameState.players = this.players;
    gameState.winner = this.winner;
    gameState.res = this.res;
    gameState.spies = this.spies;
    gameState.specialRoles = this.specialRoles;
    gameState.currentMission = this.currentMission;
    gameState.rejectTracker = this.rejectTracker;
    gameState.currentLeader = this.currentLeader;
    gameState.currentPhase = this.currentPhase;
    gameState.voting = this.voting;
    gameState.proposedTeam = this.proposedTeam;
    gameState.teamVotes = this.teamVotes;
    gameState.missionVotes = this.missionVotes;
    gameState.resultOfVotes = this.resultOfVotes;
    gameState.missionResults = this.missionResults;
    gameState.asassinated = this.assassinated;
    io.in(socket.roomName).emit('sendGameState', gameState);
  }
  writeGameState(socket, io, data) {
    const { request, payload } = data;
    const gameState = {};
    switch (request) {
      case 'toggleRole':
        this.toggleRole(payload.role);
        gameState.specialRoles = this.specialRoles;
        break;
      case 'startGame':
        this.startGame();
        gameState.specialRoles = this.specialRoles;
        gameState.spies = this.spies;
        gameState.res = this.res;
        gameState.players = this.players;
        gameState.currentPhase = this.currentPhase;
        break;
      case 'togglePlayer':
        this.togglePlayer(payload.playerId);
        gameState.gunImages = this.gunImages;
        gameState.proposedTeam = this.proposedTeam;
        break;
      case 'submitTeamNomination':
        this.voting = true;
        gameState.voting = true;
        break;
      case 'submitTeamVote':
        this.submitTeamVote(socket, payload.castedVote);
        gameState.teamVotes = this.teamVotes;
        gameState.rejectTracker = this.rejectTracker;
        gameState.voting = this.voting;
        gameState.currentPhase = this.currentPhase;
        gameState.winner = this.winner;
        break;
      case 'completeVoteReveal':
        this.completeVoteReveal();
        gameState.teamVotes = this.teamVotes;
        gameState.voting = this.voting;
        gameState.currentLeader = this.currentLeader;
        gameState.currentPhase = this.currentPhase;
        gameState.proposedTeam = this.proposedTeam;
        gameState.gunImages = this.gunImages;
        break;
      case 'submitMissionVote':
        this.submitMissionVote(socket, payload.castedVote);
        gameState.missionVotes = this.missionVotes;
        gameState.missionResults = this.missionResults;
        gameState.currentPhase = this.currentPhase;
        gameState.resultOfVotes = this.resultOfVotes;
        gameState.winner = this.winner;
        break;
      case 'completeMissionReveal':
        this.completeMissionReveal();
        gameState.resultOfVotes = this.resultOfVotes;
        gameState.currentMission = this.currentMission;
        gameState.missionVotes = this.missionVotes;
        gameState.currentLeader = this.currentLeader;
        gameState.currentPhase = this.currentPhase;
        gameState.proposedTeam = this.proposedTeam;
        gameState.gunImages = this.gunImages;
        break;
      case 'assassinatePlayer':
        this.assassinate(payload.playerId);
        gameState.assassinated = this.assassinated;
        gameState.winner = this.winner;
        break;
    }
    io.in(socket.roomName).emit('sendGameState', gameState);
  }
  toggleRole(role) {
    this.specialRoles[role] = !this.specialRoles[role];
  }
  startGame() {
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
  }
  togglePlayer(playerId) {
    if (!Object.keys(this.proposedTeam).length) {
      this.gunImages = shuffle(this.gunImages);
    }
    if (playerId in this.proposedTeam) {
      this.gunImages.push(this.proposedTeam[playerId]);
      delete this.proposedTeam[playerId];
    } else if (
      Object.keys(this.proposedTeam).length ===
      this.groupSize.missionSize[this.currentMission]
    ) {
      return;
    } else {
      this.proposedTeam[playerId] = this.gunImages.pop();
    }
  }
  submitTeamVote(socket, castedVote) {
    this.teamVotes[socket.id] = castedVote;
    if (Object.keys(this.teamVotes).length !== this.players.length) return;
    const tally = Object.values(this.teamVotes).reduce(
      (total, vote) => (total += +vote),
      0
    );
    const passed = tally > this.players.length / 2;
    if (!passed) {
      this.rejectTracker++;
    } else {
      this.rejectTracker = 0;
      this.voting = false;
    }
    this.currentPhase = 'voteReveal';
    if (this.rejectTracker === 5) this.gameOver('reject');
  }
  completeVoteReveal() {
    this.teamVotes = {};
    if (this.voting) {
      this.voting = false;
      this.nextVote();
    } else {
      this.currentPhase = 'mission';
    }
  }
  nextVote() {
    this.currentLeader = (this.currentLeader + 1) % this.players.length;
    this.currentPhase = 'teamSelection';
    this.proposedTeam = {};
    this.gunImages = gunImages;
  }
  submitMissionVote(socket, castedVote) {
    this.missionVotes[socket.id] = castedVote;
    const totalVotes = this.groupSize.missionSize[this.currentMission];
    if (Object.keys(this.missionVotes).length !== totalVotes) return;
    const tally = Object.values(this.missionVotes).reduce(
      (total, vote) => (total += +vote),
      0
    );
    if (
      ((this.players.length < 7 || this.currentMission !== 3) &&
        totalVotes - tally >= 1) ||
      totalVotes - tally >= 2
    ) {
      this.missionResults[this.currentMission] = 0;
    } else {
      this.missionResults[this.currentMission] = 1;
    }
    this.currentPhase = 'missionReveal';
    this.resultOfVotes = shuffle(Object.values(this.missionVotes));
    if (
      this.missionResults.reduce(
        (failures, mission) => (mission === 0 ? failures + 1 : failures),
        0
      ) === 3
    ) {
      this.gameOver('spiesWin');
    }
    if (
      this.missionResults.reduce(
        (successes, mission) => (mission === 1 ? successes + 1 : successes),
        0
      ) === 3
    ) {
      if (!this.specialRoles.assassin || !this.specialRoles.commander) {
        this.gameOver('resWin');
      } else {
        this.currentPhase = 'assassination';
      }
    }
  }
  completeMissionReveal() {
    this.resultOfVotes = [];
    this.currentMission++;
    this.missionVotes = {};
    this.nextVote();
  }
  assassinate(playerId) {
    this.assassinated = playerId;
    this.gameOver(
      this.specialRoles.commander === playerId
        ? 'assassinateSuccess'
        : 'assassinateFail'
    );
  }
  rejoin(socket, io, data) {
    console.log('inrejoin');
    const oldSocketId = socket.request.session.socketId;
    socket.request.session.socketId = socket.id;
    socket.request.session.save();
    const { userName } = data;
    delete this.users[oldSocketId];
    this.users[socket.id] = userName;
    socket.join(socket.roomName);
    this.getGameState(socket, io);
  }
  gameOver(reason) {
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
      case 'assassinateSuccess':
        this.winner = 'spies';
        break;
      case 'assassinateFail':
        this.winner = 'res';
        break;
    }
  }
};
