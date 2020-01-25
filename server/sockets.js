// store the games and users in server memory

module.exports = (socket, io) => {
  console.log(`A new client ${socket.id} has connected to server!`);

  socket.on('join room', roomName => {
    socket.join(roomName);
    socket.emit('joined', roomName);
    const room = io.sockets.adapter.rooms[roomName];
    const users = Object.keys(room.sockets)
      .map(key => io.sockets.connected[key].id);
    io.in(roomName).emit('newUser', users);
  });

  socket.on('disconnecting', reason => {
    const [socketId, roomName] = Object.keys(socket.rooms);
    const room = io.sockets.adapter.rooms[roomName];
    if (room) {
      const users = Object.keys(room.sockets)
        .filter(key => socketId !== io.sockets.connected[key].id)
        .map(key => io.sockets.connected[key].id);
      io.in(roomName).emit('newUser', users);
    }
  });

  socket.on('sendMessage', messageInfo => {
    const { room, message } = messageInfo;
    io.in(room).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    // we will have to make this remove the user from whatever room he/she was in
    // if that room no longer has any users in it, delete the room as well
    console.log('A client has disconnected from DEFAULT!');
  });
};
