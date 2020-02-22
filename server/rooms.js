const Games = require('./games');

module.exports = class Room {
  constructor(roomName, dedicatedScreen) {
    this.users = {};
    this.messages = [];
    this.selectedGame = '--None--';
    this.maxPlayers = 10;
    this.game = null;
    this.host = null;
    this.dedicatedScreen = dedicatedScreen;
    this.roomName = roomName;
  }
  setGame(game) {
    this.game = game;
  }
  getUsers() {
    return this.users;
  }
  setHost(id) {
    this.host = id;
  }
  selectGame(game) {
    this.selectedGame = game;
  }
  addMessage(user, message) {
    this.messages.push([user, message]);
  }
  getRoomData() {
    const roomData = {
      messages: this.messages,
      selectedGame: this.selectedGame,
      users: this.users,
      currentHost: this.host,
      dedicatedScreen: this.dedicatedScreen
    };
    return roomData;
  }
  joinRoom(userName, socket, io) {
    socket.userName = userName;
    socket.roomName = this.roomName;
    socket.hostBool = false;
    if (socket.id !== this.dedicatedScreen) {
      this.users[socket.id] = userName;
      if (!this.host) {
        this.setHost(socket.id);
        socket.hostBool = true;
      }
    }
    socket.join(this.roomName);
    socket.emit('joinedRoom', {
      userName,
      roomName: this.roomName,
      hostBool: socket.hostBool
    });
    io.in(this.roomName).emit('newUser', {
      socketId: socket.id,
      userName,
      currentHost: this.host
    });
  }
  disconnect(socket, io) {
    delete this.users[socket.id];
    const updatedUsers = Object.keys(this.users);
    if (this.dedicatedScreen === socket.id) {
      this.dedicatedScreen = null;
      io.in(this.roomName).emit('status', 'welcome screen');
      return true;
    }
    if (updatedUsers.length && socket.id === this.host) {
      let newHost = updatedUsers[0];
      socket.broadcast.to(newHost).emit('hostMigration');
      this.host = newHost;
    } else if (!updatedUsers.length) {
      this.host = null;
    }
    io.in(this.roomName).emit('removeUser', {
      socketId: socket.id,
      currentHost: this.host
    });
    if (this.game) this.gameOver(io);
    return !this.dedicatedScreen && !updatedUsers.length;   // whether room should be deleted
  }
  updateHost(socket, newHost) {
    socket.broadcast.to(newHost).emit('hostMigration');
    this.host = newHost;
  }
  startGame(game, socket, io) {
    const numPlayers = Object.keys(this.users).length;
    if (numPlayers < Games[game].min) {
      socket.emit(
        'lobbyError',
        `Minimum ${Games[game].min} players`
      );
      return;
    }
    if (numPlayers > Games[game].max) {
      socket.emit(
        'lobbyError',
        `Maximum ${Games[game].max} players`
      );
      return;
    }
    const newGame = new Games[game].instance(this.users, this.dedicatedScreen);
    this.setGame(newGame);
    io.in(this.roomName).emit('startedGame', { game });
  }
  gameOver(io) {
    this.setGame(null);
    this.selectGame('--None--');
    io.in(this.roomName).emit('status', 'lobby');
  }
  canJoin() {
    const errorObj = { status: false };
    if (this.maxPlayers === Object.keys(this.users).length)
      errorObj.msg = `${this.roomName} is at capacity`;
    else if (this.game) errorObj.msg = `${this.roomName} is already in progress`;
    else errorObj.status = true;
    return errorObj;
  }
};
