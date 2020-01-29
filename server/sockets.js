// store the games and users in server memory

// for now, each inner room object will hold its name and message history. see socket.on('join room')
const rooms = {};
const users = {};

// const games = require('./games');
const {
  TicTac,
} = require('./games');

module.exports = (socket, io) => {
  console.log(`A new client ${socket.id} has connected to server!`);
  users[socket.id] = null;

  socket.on('request data', data => {
    const { request } = data;
    switch (request) {
      case 'joined room':
        socket.emit('receive data', {
          messages: rooms[socket.roomName].messages,
          users: rooms[socket.roomName].users,
          currentHost: rooms[socket.roomName].host
        });
    }
  });

  socket.on('join room', data => {
    let { userName, roomName } = data;

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
        users: {},
        host: null,
        messages: []
      };
    }

    // IF JOINING ROOM, BUT ROOM DOES NOT EXIST, OR GAME ALREADY STARTED, RETURN
    if (!(roomName in rooms) || rooms[roomName].game) {
      socket.emit('error: room not open', {
        roomName,
        roomExists: roomName in rooms
      });
      return;
    }

    // SERVER MEMORY CODE:
    users[socket.id] = roomName;
    rooms[roomName].users[socket.id] = userName;
    if (!rooms[roomName].host) {
      rooms[roomName].host = socket.id;
      socket.hostBool = true;
    } else {
      socket.hostBool = false;
    }

    // SOCKET CODE:
    socket.userName = userName;
    socket.roomName = roomName;
    socket.join(roomName);

    socket.emit('joined room', {
      userName,
      roomName,
      hostBool: socket.hostBool
    });

    io.in(roomName).emit('new user', [socket.id, userName]);
  });

  socket.on('start game', data => {
    const { game, roomName } = data;
    rooms[roomName].game = game;
    io.in(roomName).emit('started game', { game });
  });

  socket.on('send message', data => {
    // SOCKET CODE:
    const { message } = data;
    io.in(socket.roomName).emit('receive message', {
      sender: socket.userName,
      message
    });

    // SERVER MEMORY CODE:
    rooms[socket.roomName].messages.push([socket.userName, message]);
  });

  socket.on('disconnecting', reason => {
    const [socketId, roomName] = Object.keys(socket.rooms);

    // SERVER MEMORY CODE:
    if (rooms[roomName]) {
      delete rooms[roomName].users[socketId];
      if (!Object.keys(rooms[roomName].users).length) delete rooms[roomName];
      else if (rooms[roomName].host === socketId) {
        rooms[roomName].host = Object.keys(rooms[roomName].users)[0];
      }
    }
    delete users[socketId];

    // SOCKET CODE:
    io.in(roomName).emit('remove user', {
      socketId,
      currentHost: rooms[roomName] ? rooms[roomName].host : null
    });
  });

  socket.on('disconnect', () => {
    console.log('A client has disconnected from the server!');
    // console.log('ROOMS:', rooms) // to check status of rooms object for testing
  });

  // GAMES

  socket.on('initialState', () => {
    const users = Object.keys(rooms[socket.roomName].users);
    console.log(users);
    let game = (rooms[socket.roomName].game = new TicTac(users));
    io.in(socket.roomName).emit('sendState', game.getGameState());
  });

  socket.on('move', coord => {
    let game = rooms[socket.roomName].game;
    game.move(socket.id, coord.x, coord.y);
    io.in(socket.roomName).emit('sendState', game.getGameState());
  });

};
