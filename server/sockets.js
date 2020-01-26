// store the games and users in server memory

// for now, each inner room object will hold its name and message history. see socket.on('join room')
const rooms = {};

module.exports = (socket, io) => {
  console.log(`A new client ${socket.id} has connected to server!`);

  socket.on('join room', roomName => {
    // SERVER MEMORY CODE:
    if (!(roomName in rooms)) rooms[roomName] = {
      roomName,
      messages: [],
    }; 

    // SOCKET CODE:
    socket.join(roomName);
    socket.emit('joined', rooms[roomName]);
    const room = io.sockets.adapter.rooms[roomName];
    const users = Object.keys(room.sockets)
      .map(key => io.sockets.connected[key].id);
    io.in(roomName).emit('newUser', users);   
  });

  socket.on('disconnecting', reason => {
    // SOCKET CODE:
    const [socketId, roomName] = Object.keys(socket.rooms);
    const room = io.sockets.adapter.rooms[roomName];
    if (room) {                                             // temporary fix. sometimes room is undefined.
      const users = Object.keys(room.sockets)
        .filter(key => socketId !== io.sockets.connected[key].id)
        .map(key => io.sockets.connected[key].id);
      io.in(roomName).emit('newUser', users);
    }

    // SERVER MEMORY CODE:
    if (room && Object.keys(room.sockets).length === 1) {   // last user leaves a room
      delete rooms[roomName];
    }
  });

  socket.on('sendMessage', data => {
    // SOCKET CODE:
    const { roomName, message } = data;
    io.in(roomName).emit('receiveMessage', message);

    // SERVER MEMORY CODE:
    rooms[roomName].messages.push(message);
  });

  socket.on('disconnect', () => {
    // we will have to make this remove the user from whatever room he/she was in
    // if that room no longer has any users in it, delete the room as well
    console.log('A client has disconnected from DEFAULT!');
  });
};
