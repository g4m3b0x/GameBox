import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import io from 'socket.io-client';
const socket = io();
export default socket;

ReactDOM.render(<App />, document.getElementById('app'));