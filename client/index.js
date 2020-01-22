import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

import io from 'socket.io-client';
// const clientSocket = io(window.location.origin);
// const socket = io();
// const socket = io('/new-namespace');

// socket.on('test', data => console.log(data));