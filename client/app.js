import React from 'react';
import axios from 'axios';
import socket from './index.js';

const getRandomRoom = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let room = '';
  for (let i = 0; i < 4; i++) {
    room += alphabet[Math.floor(Math.random() * 26)];
  }
  return room;
};

const App = () => {
  const handleClick = () => {
    socket.emit('join room', getRandomRoom());
  };

  return (
    <div>
      THIS IS APP.JS!
      <button onClick={handleClick}>CLICK ME</button>
    </div>
  );
};

export default App;
