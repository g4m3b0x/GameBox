import React from 'react';
import axios from 'axios';
import socket from './index.js';

const App = () => {
  const handleClick = () => {
    socket.emit('join room', 'room 1');
  };

  return (
    <div>
      THIS IS APP.JS!
      <button onClick={handleClick}>CLICK sME</button>
    </div>
  );
};

export default App;
