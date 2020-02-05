module.exports = class Rooms {
  constructor(host, dedicatedscreen) {
    this.users = [];
    this.messages = [];
    this.selectedGame = null;
    this.maxPlayers = 10;
    this.game = null;
    this.currentHost = host;
    this.dedicatedScreen = dedicatedscreen;
  }
  setGame(game) {
    this.game = game;
  }
  selectedGame(game) {
    this.selectedGame = game;
  }
  addMessage(user, message) {
    this.messages.push([user, message]);
  }
  getRoomData() {
    let roomData = {
      messages: this.messages,
      selectedGame: this.selectedGame,
      users: this.users,
      currentHost: this.host,
      dedicatedScreen: this.dedicatedScreen
    };
    return roomData;
  }
  addUser(user) {
    this.users.push(user);
  }
  remove(userToRemove) {
    this.users = this.users.filter(user => user !== userToRemove);
  }
  canJoin() {
    let errorObj = { status: false };
    if (this.maxPlayers === this.users.length)
      errorObj.msg = 'Game is at capacity';
    else if (this.game) errorObj.msg = 'Game is already in progress';
    else errorObj.status = true;
    return errorObj;
  }
};
