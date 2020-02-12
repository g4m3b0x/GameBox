import React from 'react';
import socket from '../../../index.js';

function missionVote(castedVote) {
  socket.emit('missionVote', castedVote);
}

const Mission = props => {
  return props.activePlayers[socket.id] ? (
    <div>
      <button onClick={() => missionVote(true)}>Success</button>
      <button onClick={() => missionVote(false)}>Fail </button>
    </div>
  ) : (
    <div>
      <p> Players on mission are currrently casting their vote</p>
    </div>
  );
};

export default Mission;
