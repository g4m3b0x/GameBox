module.exports = (socket, io, rooms, users) => {
  socket.on('lobby reducer', data => {
    const { request, payload } = data;
    switch (request) {
      case 'change selected game':
        const { game } = payload;
        rooms[socket.roomName].selectedGame = game;
        io.in(socket.roomName).emit('changed selected game', game);
        return;
      case 'send message':
        const { message } = payload;
        rooms[socket.roomName].messages.push([socket.userName, message]);
        io.in(socket.roomName).emit('receive message', {
          sender: socket.userName,
          message
        });
        return;
    }
  });
};
