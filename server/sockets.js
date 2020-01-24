// store the games and users in server memory

module.exports = (socket, io) => {
  console.log(`A new client ${socket.id} has connected to server!`);

  socket.on('join room', room => {
    socket.join(room);
    socket.emit('joined', room);
  });

  socket.on('sendMessage', messageInfo => {
    const { room, message } = messageInfo;
    io.in(room).emit('recieveMessage', message);
  });

  socket.on('disconnect', () => {
    // we will have to make this remove the user from whatever room he/she was in
    // if that room no longer has any users in it, delete the room as well
    console.log('A client has disconnected from DEFAULT!');
  });
};
