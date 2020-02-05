/* eslint-disable default-case */
/* eslint-disable complexity */
const games = require('../games/');
const Rooms = require('../rooms');
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
<<<<<<< HEAD
      case 'createRoom':
        let { userName, dedicatedScreen } = payload;
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let roomName = '';
        do {
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
=======
      case 'join room':
        let { userName, roomName, dedicatedScreen } = payload; // roomName will be modified

        // IF JOINING ROOM, BUT ROOM DOES NOT EXIST, OR GAME ALREADY STARTED, RETURN
        if (roomName && (!(roomName in rooms) || rooms[roomName].game)) {
          socket.emit('error: room not open', {
            roomName,
            roomExists: roomName in rooms
          });
          return;
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
            messages: []
          };
        }
>>>>>>> 9b3872612bcafe03764537447150a335038b6fbb

        users[socket.id] = roomName;
        if (socket.id !== dedicatedScreen)
          rooms[roomName].users[socket.id] = userName;

        // SOCKET CODE:
        socket.userName = userName;
        socket.roomName = roomName;
        if (socket.id === dedicatedScreen) {
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
<<<<<<< HEAD
        });
        return;
      case 'join room':
        // let { roomName } = payload; // roomName will be modified

        // IF JOINING ROOM, BUT ROOM DOES NOT EXIST, OR ROOM IS FULL, OR GAME ALREADY STARTED, RETURN

        const errorObj = {};
        if (!(payload.roomName in rooms)) {
          errorObj.message = `Invalid room name ${payload.roomName}`;
        } else if (rooms[payload.roomName].game) {
          errorObj.message = `Game ${payload.roomName} has already started`;
        } else if (
          Object.keys(rooms[payload.roomName].users).length ===
          rooms[payload.roomName].maxPlayers
        ) {
          errorObj.message = `Room ${payload.roomName} at max capacity`;
        }
        if (errorObj.message) {
          socket.emit('error: cannot join room', {
            message: errorObj.message
          });
          return;
        }

        users[socket.id] = payload.roomName;

        rooms[payload.roomName].users[socket.id] = payload.userName;

        socket.userName = payload.userName;
        socket.roomName = payload.roomName;
        if (rooms[payload.roomName].host) {
          socket.hostBool = false;
        } else {
          rooms[payload.roomName].host = socket.id;
          socket.hostBool = true;
        }

        socket.join(payload.roomName);
        socket.emit('joined room', {
          userName: payload.userName,
          roomName: payload.roomName,
          hostBool: socket.hostBool
        });

        io.in(payload.roomName).emit('new user', {
          socketId: socket.id,
          userName: payload.userName,
          currentHost: rooms[payload.roomName].host
=======
>>>>>>> 9b3872612bcafe03764537447150a335038b6fbb
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
