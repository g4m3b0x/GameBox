import React, { useState } from 'react';
import axios from 'axios';
import socket from './index.js';

import Welcome from './components/welcome.js';

// const getRandomRoom = () => {
//   const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   let room = '';
//   for (let i = 0; i < 4; i++) {
//     room += alphabet[Math.floor(Math.random() * 26)];
//   }
//   return room;
// };

const App = () => {
  // socket.on('joined', data => console.log(data));

  // console.log(socket);
  // const handleClick = () => {
  //   socket.emit('join room', getRandomRoom());
  // };
  // const [name, setName] = useState('');
  // const joinClick = () => {
  //   socket.emit('join room', name);
  // };

  return (
    <div>
      <Welcome />
      {/* THIS IS APP.JS!
      <input
        type="text"
        name="room-name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={joinClick}> Join Room</button>
      <button onClick={handleClick}>Create Room</button> */}
    </div>
  );
};

export default App;
