const Room = require('../rooms');
module.exports = (socket, io, rooms, users) => {
  socket.on('joinedRoom', () => {
    socket.emit('sendRoomData', rooms[socket.roomName].getRoomData());
  });
  socket.on('createRoom', data => {
    const { userName, dedicatedScreen } = data;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let roomName;
    do {
      roomName = '';
      for (let i = 0; i < 4; i++) {
        roomName += alphabet[Math.floor(Math.random() * 26)];
      }
    } while (roomName in rooms);
    rooms[roomName] = new Room(roomName, dedicatedScreen);
    rooms[roomName].joinRoom(userName, socket, io);
  });
  socket.on('joinRoom', data => {
    const { userName, roomName } = data;
    const errorObj = rooms[roomName]
      ? rooms[roomName].canJoin()
      : { status: false, msg: `Invalid room: ${roomName}` };
    if (!errorObj.status) {
      socket.emit('errorOnJoin', errorObj);
      return;
    }
    rooms[roomName].joinRoom(userName, socket, io);
  });
  socket.on('exitRoom', () => {
    socket.emit('status', 'welcome screen');
  });
  socket.on('startGame', game => {
    rooms[socket.roomName].startGame(game, socket, io);
  });
  socket.on('returnToLobby', () => {
    rooms[socket.roomName].gameOver(io);
  });
};