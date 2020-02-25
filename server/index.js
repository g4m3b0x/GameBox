// INITIALIZATIONS

const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
// START EXPRESS SERVER

const PORT = process.env.PORT || 1337;
const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// SOCKET.IO CODE
const sessionMiddleware = session({
  secret: 'a secret'
});

const socketio = require('socket.io');
const io = socketio(server); // places a socket.io/socket.io.js route onto server
app.use(sessionMiddleware);

io.use((socket, next) =>
  sessionMiddleware(socket.request, socket.request.res, next)
);

io.on('connection', socket => {
  if (!socket.request.session.socketId) {
    socket.request.session.socketId = socket.id;
    socket.request.session.save();
  }
  require('./sockets/')(socket, io);
});

// EXPRESS ROUTES

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

// sends index.html
app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});
