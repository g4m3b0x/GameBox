// store the games and users in server memory

// for now, each inner room object will hold its name and message history. see socket.on('join room')
const rooms = {};

module.exports = (socket, io) => {
  console.log(`A new client ${socket.id} has connected to server!`);

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

      // SERVER MEMORY CODE:
      rooms[roomName] = {
        roomName,
        users: {},
        host: null,
        messages: []
      };
    }

    // IF JOINING ROOM, BUT ROOM DOES NOT EXIST, RETURN
    if (!(roomName in rooms)) return;

    // SERVER MEMORY CODE:
    rooms[roomName].users[socket.id] = userName;
    if (!rooms[roomName].host) rooms[roomName].host = socket.id;

    // SOCKET CODE:
    socket.join(roomName);

    socket.emit('joined room', {
      userId: socket.id,
      userName: userName,
      roomData: rooms[roomName]
    });

    io.in(roomName).emit('newUser', [socket.id, userName]);

    // DELETE THIS AFTER A WHILE IF THE CURRENT CODE IS WORKING FINE:

    // const room = io.sockets.adapter.rooms[roomName];
    // const users = Object.keys(room.sockets)
    //   .map(key => io.sockets.connected[key].id);
    // io.in(roomName).emit('newUser', users);
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

    // SOCKET CODE:
    io.in(roomName).emit('removeUser', {
      socketId,
      currentHost: rooms[roomName] ? rooms[roomName].host : null
    });

    // DELETE THIS AFTER A WHILE IF THE CURRENT CODE IS WORKING FINE:

    // SOCKET CODE:
    // const [socketId, roomName] = Object.keys(socket.rooms);
    // const room = io.sockets.adapter.rooms[roomName];
    // if (room) {     // temporary fix. sometimes room is undefined.
    //   const users = Object.keys(room.sockets)
    //     .filter(key => socketId !== io.sockets.connected[key].id)
    //     .map(key => io.sockets.connected[key].id);
    //   io.in(roomName).emit('newUser', users);
    // }

    // // SERVER MEMORY CODE:
    // if (room && Object.keys(room.sockets).length === 1) {   // last user leaves a room
    //   delete rooms[roomName];
    // }
  });
  socket.on('startingGame', data => {
    const { roomName, game } = data;
    io.in(roomName).emit('startGame', {
      game,
      roomData: rooms[roomName]
    });
  });

  socket.on('sendMessage', data => {
    // SOCKET CODE:
    const { roomName, sender, message } = data;
    io.in(roomName).emit('receiveMessage', {
      sender,
      message
    });

    // SERVER MEMORY CODE:
    rooms[roomName].messages.push([sender, message]);
  });

  socket.on('disconnect', () => {
    // we will have to make this remove the user from whatever room he/she was in
    // if that room no longer has any users in it, delete the room as well
    console.log('A client has disconnected from the server!');
    // console.log('ROOMS:', rooms)   // to check status of rooms object for testing
  });
};
