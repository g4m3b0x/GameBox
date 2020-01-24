// store the games and users in server memory

module.exports = (socket, io) => {
  console.log(`A new client ${socket.id} has connected to server!`);

  socket.on('join room', room => {
    const users = [];
    socket.join(room);
    socket.emit('joined', room);
    const sockets = io.sockets.adapter.rooms[room].sockets;
    for (let key in sockets) {
      let user = io.sockets.connected[key].id;
      users.push(user);
    }
    io.in(room).emit('newUser', users);
  });

  socket.on('disconnecting', reason => {
    let users = [];
    let rooms = Object.keys(socket.rooms); // [socketId, roomName]  --> {}
    console.log(rooms[1], 'disconnecting'); // roomName
    console.log(io.sockets.adapter.rooms[rooms[1]]);
    // console.log(io.sockets.adapter.rooms[rooms[1]].sockets);
    console.log('REASON:', reason);
    let room = io.sockets.adapter.rooms[rooms[1]];
    if (room) {
      const sockets = room.sockets; // when numbers, roomName is idx 0 instead

      for (let key in sockets) {
        let temp = io.sockets.connected[key].id;
        if (temp !== rooms[0]) users.push(temp);
      }
      io.in(rooms[1]).emit('newUser', users);
    }
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
