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
  socket.on('toggleRole', data => {
    const game = rooms[socket.roomName].game;
    game.toggleRole(io, socket, data);
  });
  socket.on('startGame', () => {
    const game = rooms[socket.roomName].game;
    game.startGame(io, socket);
  })
  socket.on('proposingTeam', data => {
    const game = rooms[socket.roomName].game;
    game.proposeTeam(io, socket, data);
  });
  socket.on('startTeamVote', () => {
    const game = rooms[socket.roomName].game;
    game.startTeamVote(io, socket);
  });
  socket.on('submitTeamVote', data => {
    const game = rooms[socket.roomName].game;
    game.submitTeamVote(io, socket, data);
  });
  socket.on('completeVoteReveal', () => {
    const game = rooms[socket.roomName].game;
    game.completeVoteReveal(io, socket);
  });
  socket.on('submitMissionVote', data => {
    const game = rooms[socket.roomName].game;
    game.submitMissionVote(io, socket, data);
  });
  socket.on('completeMissionReveal', () => {
    const game = rooms[socket.roomName].game;
    game.completeMissionReveal(io, socket);
  });
};
