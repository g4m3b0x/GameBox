import React from 'react';
import socket from '../../../index.js';

function setProposeTeam(id) {
  socket.emit('proposingTeam', {
    id
  });
}
function startVote() {
  socket.emit('startVote', 'startVote');
}
const Proposal = props => {
  return props.activePlayers[socket.id] ? (
    <div>
      <p>You are partyLeader</p>
      <ol>
        {Object.keys(props.users).map(user => (
          <button onClick={() => setProposeTeam(user)}>
            {props.users[user]}
          </button>
        ))}
      </ol>
      <button onClick={startVote}>Finalize Selection</button>
    </div>
  ) : (
    <div>
      <p>Party leader is selecting</p>
    </div>
  );
};
