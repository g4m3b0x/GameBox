// store the games and users in server memory

// for now, each inner room object will hold its name and message history. see socket.on('join room')
const rooms = {};
const users = {};

module.exports = (socket, io) => {
  console.log(`A new client ${socket.id} has connected to server!`);
  users[socket.id] = null;

  socket.on('request data', data => {
    const {request, userId} = data;
    const roomName = users[userId];
    switch (request) {
      case 'joined room':
        socket.emit('receive data', {
          userName: rooms[roomName].users[socket.id],
          roomName: users[userId],
          messages: rooms[roomName].messages,
          users: rooms[roomName].users,
          currentHost: rooms[roomName].host,
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
        gameStarted: false,
        users: {},
        host: null,
        messages: []
      };
    }

    // IF JOINING ROOM, BUT ROOM DOES NOT EXIST, OR GAME ALREADY STARTED, RETURN
    if (!(roomName in rooms) || rooms[roomName].gameStarted) {
      socket.emit('error: room not open', {
        roomName,
        roomExists: roomName in rooms,
      });
      return;
    }

    // SERVER MEMORY CODE:
    users[socket.id] = roomName;
    rooms[roomName].users[socket.id] = userName;
    if (!rooms[roomName].host) rooms[roomName].host = socket.id;

    // SOCKET CODE:
    socket.join(roomName);

    socket.emit('joined room', {
      userId: socket.id,
      userName: userName,
      roomData: rooms[roomName]
    });

    io.in(roomName).emit('new user', [socket.id, userName]);
  });

  socket.on('start game', data => {
    const { roomName, game } = data;
    rooms[roomName].gameStarted = true;
    io.in(roomName).emit('started game', {
      game,
      roomData: rooms[roomName]
    });
  });

  socket.on('send message', data => {
    // SOCKET CODE:
    const { roomName, sender, message } = data;
    io.in(roomName).emit('receive message', {
      sender,
      message
    });

    // SERVER MEMORY CODE:
    rooms[roomName].messages.push([sender, message]);
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
};
