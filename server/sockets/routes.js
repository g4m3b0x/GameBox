/* eslint-disable default-case */
/* eslint-disable complexity */
const games = require('../games/');
const Rooms = require('../rooms');
module.exports = (socket, io, rooms, users) => {
  socket.on('routes reducer', data => {
    const { request, payload } = data;
    switch (request) {
      case 'joined room':
        socket.emit('send room data', rooms[socket.roomName].getRoomData());
        return;
      case 'createRoom':
        let { userName, dedicatedScreen } = payload;
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let roomName;
        do {
          roomName = '';
          for (let i = 0; i < 4; i++) {
            roomName += alphabet[Math.floor(Math.random() * 26)];
          }
        } while (roomName in rooms);

        rooms[roomName] = new Rooms(roomName, dedicatedScreen);
        let currRoom = rooms[roomName];
        users[socket.id] = roomName;

        currRoom.joinRoom(userName, io, socket);

        return;
      case 'join room':
        // let { roomName } = payload; // roomName will be modified

        // IF JOINING ROOM, BUT ROOM DOES NOT EXIST, OR ROOM IS FULL, OR GAME ALREADY STARTED, RETURN

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
