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

io.on('connection', serverSocket => {
  console.log('A new client has connected!');
  console.log(serverSocket.id);

  serverSocket.on('disconnect', () => {
    console.log('A client has disconnected!');
  });
});


// EXPRESS ROUTES

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

// sends index.html
app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});