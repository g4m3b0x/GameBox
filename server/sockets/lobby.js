module.exports = (socket, io, rooms, users) => {
  socket.on('changeSelectedGame', game => {
    rooms[socket.roomName].selectedGame = game;
    io.in(socket.roomName).emit('updateSelectedGame', game);
  });
  socket.on('sendMessage', message => {
    rooms[socket.roomName].messages.push([socket.id, message]);
    io.in(socket.roomName).emit('receiveMessage', {
      senderId: socket.id,
      message
    });
  });
};
