import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

ReactDOM.render(<App />, document.getElementById('app'));

import io from 'socket.io-client';
// const clientSocket = io(window.location.origin);
const socket = io();
// socket.on('joined', info => console.log('derp'));
// const socket = io('/new-namespace');
export default socket;
socket.on('joined', data => console.log(data));
