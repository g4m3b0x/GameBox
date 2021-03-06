import React from 'react';
import socket from '../../../index.js';
import style from './style';

import { writeGameState } from '../functions';

const MissionRevealInput = props => {
  const { gameState } = props;
  return socket.id === gameState.players[gameState.currentLeader] ? (
    <React.Fragment>
      <p>Discuss results and proceed when ready...</p>
      <button
        style={style.genericButton}
        onClick={() => writeGameState('completeMissionReveal')}
      >
        Next
      </button>
    </React.Fragment>
  ) : (
    <p>Waiting for {gameState.users[gameState.players[gameState.currentLeader]]} to proceed...</p>
  );
};

export default MissionRevealInput;