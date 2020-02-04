// INITIALIZATIONS

const path = require('path');
const express = require('express');
const app = express();

// START EXPRESS SERVER

const PORT = process.env.PORT || 1337;
const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// SOCKET.IO CODE

const socketio = require('socket.io');
const io = socketio(server);  // places a socket.io/socket.io.js route onto server
io.on('connection', socket => require('./sockets/')(socket, io));

// EXPRESS ROUTES

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

// sends index.html
app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});
