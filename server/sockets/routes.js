/* eslint-disable default-case */
/* eslint-disable complexity */
const games = require('../games/');
const Room = require('../rooms');
module.exports = (socket, io, rooms, users) => {
  socket.on('routes reducer', data => {
    const { request, payload } = data;
    switch (request) {
      case 'joined room':
        socket.emit('send room data', rooms[socket.roomName].getRoomData());
        return;
      case 'create room':
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let roomName;
        do {
          roomName = '';
          for (let i = 0; i < 4; i++) {
            roomName += alphabet[Math.floor(Math.random() * 26)];
          }
        } while (roomName in rooms);
        rooms[roomName] = new Room(roomName, payload.dedicatedScreen);
        const currRoom = rooms[roomName];
        users[socket.id] = roomName;
        currRoom.joinRoom(payload.userName, io, socket);
        return;
      case 'join room':
        const errorObj = rooms[payload.roomName]
          ? rooms[payload.roomName].canJoin()
          : { status: false, msg: 'invalid room' };
        if (!errorObj.status) {
          socket.emit('error: cannot join room', errorObj);
          return;
        }
        users[socket.id] = payload.roomName;
        rooms[payload.roomName].joinRoom(payload.userName, io, socket);
        return;
      case 'start game':
        const { game } = payload;
        rooms[socket.roomName].startGame(game, io);
        return;
      case 'return to lobby':
        rooms[socket.roomName].gameOver(io);
        return;
    }
  });
};
