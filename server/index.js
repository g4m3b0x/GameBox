// INITIALIZATIONS

const path = require('path');
const express = require('express');
const app = express();

// START EXPRESS SERVER

const PORT = 1337;
const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// SOCKET.IO CODE

const socketio = require('socket.io');
const io = socketio(server);            // creates a connection server for web sockets...
                                        // ...and places a socket.io/socket.io.js route onto server

io.on('connection', socket => {
  console.log('A new client has connected to DEFAULT!');
  console.log(socket.id);

  socket.on('disconnect', () => {
    console.log('A client has disconnected from DEFAULT!');
  });
});

const nsp = io.of('/new-namespace');
nsp.on('connection', socket => {
  console.log('A new client has connected to NEW NAMESPACE!');
  console.log(socket.id);
  // nsp.emit('test', 'hello world');
  // socket.emit('test', 'hello world');

  socket.on('disconnect', () => {
    console.log('A client has disconnected from NEW NAMESPACE!');
  });
});
// nsp.emit('test', 'hello world');

// EXPRESS ROUTES

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

// sends index.html
app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});