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
  joinRoom(userName, io, socket) {
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
  remove(id) {
    delete this.users[id];
  }
  startGame(game, io, socket) {
    const numPlayers = Object.keys(this.users).length;
    if (numPlayers < Games[game].min) {
      socket.emit(
        'error: wrong number of players',
        `Minimum ${Games[game].min} players`
      );
      return;
    }
    if (numPlayers > Games[game].max) {
      socket.emit(
        'error: wrong number of players',
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
      errorObj.msg = 'Game is at capacity';
    else if (this.game) errorObj.msg = 'Game is already in progress';
    else errorObj.status = true;
    return errorObj;
  }
};
