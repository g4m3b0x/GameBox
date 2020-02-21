module.exports = (socket, io, rooms, users) => {
  socket.on('getGameState', () => {
    const game = rooms[socket.roomName].game;
    game.getGameState(socket, io);
  });
  socket.on('writeGameState', data => {
    const game = rooms[socket.roomName].game;
    game.writeGameState(socket, io, data);
  });
};
