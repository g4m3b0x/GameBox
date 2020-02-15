import React from 'react';
import style from './style';

const StatusBar = props => {
  const { gameState } = props;
  return (
    <div style={style.statusBar}>
      <p>
        MISSION
        {' ' + (gameState.currentMission + 1) + ' '}
        {gameState.players.length &&
          `| Leader: ${gameState.users[gameState.players[gameState.currentLeader]]}`
        }
      </p>
    </div>
  );
};

export default StatusBar;