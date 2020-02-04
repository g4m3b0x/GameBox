const rooms = {};
const users = {};

module.exports = (socket, io) => {
  console.log(`A new client ${socket.id} has connected to server!`);

  require('./routes')(socket, io, rooms, users);
  require('./lobby')(socket, io, rooms, users);
  require('./gameData')(socket, io, rooms, users);
  require('./disconnect')(socket, io, rooms, users);
};
