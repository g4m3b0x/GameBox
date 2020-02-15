import React from 'react';
import socket from '../../../index.js';
import style from './style';

function completeMissionReveal() {
  socket.emit('completeMissionReveal');
}

const MissionRevealInput = props => {
  const { gameState } = props;
  return socket.id === gameState.players[gameState.currentLeader] ? (
    <React.Fragment>
      <p>Discuss results and proceed when ready...</p>
      <button
        style={style.genericButton}
        onClick={completeMissionReveal}
      >
        Next mission
      </button>
    </React.Fragment>
  ) : (
    <p>Waiting for {gameState.users[gameState.players[gameState.currentLeader]]} to proceed...</p>
  );
};

export default MissionRevealInput;