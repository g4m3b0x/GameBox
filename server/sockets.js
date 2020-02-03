// store the games and users in server memory

// for now, each inner room object will hold its name and message history. see socket.on('join room')
const rooms = {};
const users = {};

const games = require('./games');

module.exports = (socket, io) => {
  console.log(`A new client ${socket.id} has connected to server!`);
  // users[socket.id] = null;

  socket.on('request data from server', data => {
    const { request, payload } = data;
    const game = rooms[socket.roomName].game;
    switch (request) {
      case 'joined room':
        socket.emit('send room data', {
          messages: rooms[socket.roomName].messages,
          users: rooms[socket.roomName].users,
          currentHost: rooms[socket.roomName].host,
          dedicatedScreen: rooms[socket.roomName].dedicatedScreen,
        });
        return;
      case 'get initial game state':
        io.in(socket.roomName).emit('send game state', game.getGameState());
        return;
      case 'send move':
        game.move(socket.id, payload);
        io.in(socket.roomName).emit('send game state', game.getGameState());
        return;
    }
  });

  socket.on('join room', data => {
    let { userName, roomName, dedicatedScreen } = data;

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
        users: {},
        host: null,
        dedicatedScreen,
        messages: []
      };
    }

    // SERVER MEMORY CODE:
    users[socket.id] = roomName;
    if (socket.id !== dedicatedScreen) rooms[roomName].users[socket.id] = userName;

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
      currentHost: rooms[roomName].host,
    });
  });

  socket.on('change selected game', data => {
    const { game } = data;
    io.in(socket.roomName).emit('changed selected game', game);
  });

  socket.on('start game', data => {
    const { game } = data;
    rooms[socket.roomName].game = new (games[game])(    // this launches the actual game
      rooms[socket.roomName].users,
      rooms[socket.roomName].dedicatedScreen
    );
    io.in(socket.roomName).emit('started game', { game });
  });

  socket.on('return to lobby', () => {
    rooms[socket.roomName].game = null;
    io.in(socket.roomName).emit('status', 'lobby');
  });
  
  socket.on('send message', data => {
    const { message } = data;
    rooms[socket.roomName].messages.push([socket.userName, message]);
    io.in(socket.roomName).emit('receive message', {
      sender: socket.userName,
      message
    });
  });

  socket.on('disconnecting', reason => {
    const roomName = socket.roomName;     // for brevity

    // SERVER MEMORY CODE:
    if (rooms[roomName]) {
      delete rooms[roomName].users[socket.id];
      if (rooms[roomName].dedicatedScreen === socket.id) rooms[roomName].dedicatedScreen = null;
      if (!rooms[roomName].dedicatedScreen && !Object.keys(rooms[roomName].users).length) delete rooms[roomName];
      else if (rooms[roomName].host === socket.id) {
        const otherUsers = Object.keys(rooms[roomName].users).filter(user => user !== rooms[roomName].dedicatedScreen);
        if (otherUsers.length) {
          rooms[roomName].host = otherUsers[0];
          socket.broadcast.to(otherUsers[0]).emit('you are now host');
        } else {
          rooms[roomName].host = null;
        }
      }
    }
    delete users[socket.id];

    // SOCKET CODE:
    io.in(roomName).emit('remove user', {
      socketId: socket.id,
      currentHost: rooms[roomName] ? rooms[roomName].host : null
    });
  });

  socket.on('disconnect', () => {
    console.log('A client has disconnected from the server!');
    // console.log('ROOMS:', rooms) // to check status of rooms object for testing
    // console.log('USERS:', users) // to check status of users object for testing
  });
};
