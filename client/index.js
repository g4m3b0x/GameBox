import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import ioClient from 'socket.io-client';
const socket = ioClient();
export default socket;

ReactDOM.render(<App />, document.getElementById('app'));