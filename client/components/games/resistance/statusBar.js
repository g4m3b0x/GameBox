import React from 'react';
import style from './style';

const StatusBar = props => {
  const gameState = props.gameState;
  return (
    <div style={style.statusBar}>
      <p>
        MISSION
        {' ' + (gameState.currentMission + 1) + ' '}
        {gameState.currentPhase === 'teamSelection' && gameState.players.length &&
          `| Leader: ${gameState.users[gameState.players[gameState.currentLeader % gameState.players.length]]}`
        }
      </p>
    </div>
  );
};

export default StatusBar;