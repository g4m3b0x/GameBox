module.exports = (socket, io, rooms, users) => {
  socket.on('disconnecting', reason => {
    const currRoom = rooms[socket.roomName];
    if (currRoom && !currRoom.game) {
      if (currRoom.disconnect(socket, io)) delete rooms[socket.roomName];
    }
  });
  socket.on('disconnect', () => {
    console.log('A client has disconnected from the server!');
  });
};
