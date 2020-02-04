/* eslint-disable default-case */
/* eslint-disable complexity */
const games = require('../games/');

module.exports = (socket, io, rooms, users) => {
  socket.on('routes reducer', data => {
    const { request, payload } = data;
    switch (request) {
      case 'joined room':
        socket.emit('send room data', {
          messages: rooms[socket.roomName].messages,
          selectedGame: rooms[socket.roomName].selectedGame,
          users: rooms[socket.roomName].users,
          currentHost: rooms[socket.roomName].host,
          dedicatedScreen: rooms[socket.roomName].dedicatedScreen
        });
        return;
      case 'join room':
        let { userName, roomName, dedicatedScreen } = payload; // roomName will be modified

        // IF JOINING ROOM, BUT ROOM DOES NOT EXIST, OR ROOM IS FULL, OR GAME ALREADY STARTED, RETURN
        let errorObj = {};
        // if (
        //   roomName &&
        //   (!(roomName in rooms) ||
        //     Object.keys(rooms[roomName].users).length ===
        //       rooms[roomName].maxPlayers ||
        //     rooms[roomName].game)
        // ) {
        //   socket.emit('error: room not open', {
        //     roomName,
        //     roomExists: roomName in rooms
        //   });
        //   return;
        // }
        if (roomName) {
          if (!(roomName in rooms))
            errorObj.message = `Invalid room name ${roomName}`;
          if (
            Object.keys(rooms[roomName].users).length ===
            rooms[roomName].maxPlayers
          )
            errorObj.message = 'Room at max capacity';
          if (rooms[roomName].game)
            errorObj.message = 'Game has already started';
          if (errorObj.message) {
            socket.emit('error: room not open', {
              roomName,
              message: errorObj.message
            });
            return;
          }
        }

        // IF CREATING ROOM, GENERATE RANDOM UNUSED ROOM CODE:
        if (!roomName) {
          const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          do {
            roomName = '';
            for (let i = 0; i < 4; i++) {
              roomName += alphabet[Math.floor(Math.random() * 26)];
            }
          } while (roomName in rooms);
          rooms[roomName] = {
            roomName,
            game: null,
            selectedGame: '--None--',
            users: {},
            host: null,
            dedicatedScreen,
            messages: [],
            maxPlayers: 10
          };
        }

        // SERVER MEMORY CODE:
        users[socket.id] = roomName;
        if (socket.id !== dedicatedScreen)
          rooms[roomName].users[socket.id] = userName;

        // SOCKET CODE:
        socket.userName = userName;
        socket.roomName = roomName;
        if (socket.id === dedicatedScreen || rooms[roomName].host) {
          socket.hostBool = false;
        } else {
          rooms[roomName].host = socket.id;
          socket.hostBool = true;
        }

        socket.join(roomName);
        socket.emit('joined room', {
          userName,
          roomName,
          hostBool: socket.hostBool
        });

        io.in(roomName).emit('new user', {
          socketId: socket.id,
          userName,
          currentHost: rooms[roomName].host
        });
        return;
      case 'start game':
        const { game } = payload;
        rooms[socket.roomName].game = new games[game]( // this launches the actual game
          rooms[socket.roomName].users,
          rooms[socket.roomName].dedicatedScreen
        );
        io.in(socket.roomName).emit('started game', { game });
        return;
      case 'return to lobby':
        rooms[socket.roomName].game = null;
        rooms[socket.roomName].selectedGame = '--None--';
        io.in(socket.roomName).emit('status', 'lobby');
        return;
    }
  });
};
