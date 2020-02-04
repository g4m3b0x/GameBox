module.exports = (socket, io, rooms, users) => {
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