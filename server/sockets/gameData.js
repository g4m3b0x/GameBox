module.exports = (socket, io, rooms, users) => {
  socket.on('getGameState', () => {
    const game = rooms[socket.roomName].game;
    game.getGameState(socket, io);
  });
  socket.on('writeGameState', data => {
    const game = rooms[socket.roomName].game;
    game.writeGameState(socket, io, data);
  });
  socket.on('rejoin', data => {
    const { roomName } = data;
    // console.log(data, 'oldSocketId', socket.id);
    if (!rooms[roomName]) return;
    const room = rooms[roomName];
    room.rejoin(socket, data);
    const game = room.game;
    game.rejoin(socket, io, data);
  });
};
