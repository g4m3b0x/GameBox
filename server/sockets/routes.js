/* eslint-disable default-case */
/* eslint-disable complexity */

const Room = require('../rooms');
module.exports = (socket, io, rooms, users) => {
  socket.on('routesReducer', data => {
    const { request, payload } = data;
    switch (request) {
      case 'joinedRoom':
        socket.emit('sendRoomData', rooms[socket.roomName].getRoomData());
        return;
      case 'createRoom':
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
        currRoom.joinRoom(payload.userName, io, socket);
        return;
      case 'joinRoom':
        const errorObj = rooms[payload.roomName]
          ? rooms[payload.roomName].canJoin()
          : { status: false, msg: 'invalid room' };
        if (!errorObj.status) {
          socket.emit('errorOnJoin', errorObj);
          return;
        }
        rooms[payload.roomName].joinRoom(payload.userName, io, socket);
        return;
      case 'exitRoom':
        socket.emit('status', 'welcome screen');
        return;
      case 'startGame':
        const { game } = payload;
        rooms[socket.roomName].startGame(game, io, socket);
        return;
      case 'returnToLobby':
        rooms[socket.roomName].gameOver(io);
        return;
    }
  });
};
