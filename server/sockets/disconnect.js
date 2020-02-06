module.exports = (socket, io, rooms, users) => {
  socket.on('disconnecting', reason => {
    const currRoom = rooms[socket.roomName];
    if (currRoom) {
      let deleteRoom = currRoom.disconnect(io, socket);
      if (deleteRoom) delete rooms[socket.roomName];
    }
  });

  socket.on('disconnect', () => {
    console.log('A client has disconnected from the server!');
    // console.log('ROOMS:', rooms) // to check status of rooms object for testing
    // console.log('USERS:', users) // to check status of users object for testing
  });
};
