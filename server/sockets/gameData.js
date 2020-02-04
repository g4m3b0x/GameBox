module.exports = (socket, io, rooms, users) => {
  socket.on('game data reducer', data => {
    const { request, payload } = data;
    const game = rooms[socket.roomName].game;
    switch (request) {
      case 'get initial game state':
        io.in(socket.roomName).emit('send game state', game.getGameState());
        return;
      case 'send move':
        game.move(socket.id, payload);
        io.in(socket.roomName).emit('send game state', game.getGameState());
        return;
    }
  });
};