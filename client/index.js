import io from 'socket.io-client';
// const clientSocket = io(window.location.origin);
// io();
const socket = io('/new-namespace');

socket.on('test', data => console.log(data));