module.exports = (socket, io, rooms, users) => {
  socket.on('lobbyReducer', data => {
    const { request, payload } = data;
    switch (request) {
      case 'changeSelectedGame':
        const { game } = payload;
        rooms[socket.roomName].selectedGame = game;
        io.in(socket.roomName).emit('changedSelectedGame', game);
        return;
      case 'sendMessage':
        const { message } = payload;
        rooms[socket.roomName].messages.push([socket.id, message]);
        io.in(socket.roomName).emit('receiveMessage', {
          senderId: socket.id,
          message
        });
        return;
    }
  });
};
