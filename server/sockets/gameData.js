module.exports = (socket, io, rooms, users) => {
  socket.on('gameDataReducer', data => {
    const { request, payload } = data;
    const game = rooms[socket.roomName].game;
    switch (request) {
      case 'getInitGameState':
        io.in(socket.roomName).emit('sendGameState', game.getGameState());
        return;
      case 'sendMove':
        game.move(socket.id, payload);
        io.in(socket.roomName).emit('sendGameState', game.getGameState());
        return;
    }
  });
  socket.on('proposingTeam', data => {
    const game = rooms[socket.roomName].game;
    game.proposeTeam(io, socket, data);
  });
  socket.on('startVote', () => {
    const game = rooms[socket.roomName].game;
    game.startVote(io, socket);
  });
  socket.on('submitVote', data => {
    const game = rooms[socket.roomName].game;
    game.submitVote(io, socket, data);
  });
  socket.on('getActivePlayers', () => {
    const game = rooms[socket.roomName].game;
    game.sendActivePlayers(io, socket);
  });
};
