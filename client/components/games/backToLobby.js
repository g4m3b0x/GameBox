import React from 'react';
import socket from '../../index.js';

const BackToLobby = () => {
  return (
    <button
      className="tiny-button"
      onClick={() => socket.emit('returnToLobby')}
    >
      Back to Lobby
    </button>
  );
};

export default BackToLobby;