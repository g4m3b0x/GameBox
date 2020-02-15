import React from 'react';
import style from './style';

import Avatar from './avatar';
import MissionInfo from './missionInfo';

const seatingArrangementChart = {
  1: {
    top: [0],
    middle: [],
    bottom: [],
  },
  5: {
    top: [0],
    middle: [4, 1],
    bottom: [2, 3],
  },
  6: {
    top: [0, 1],
    middle: [5, 2],
    bottom: [3, 4],
  },
  7: {
    top: [0, 1],
    middle: [6, 2],
    bottom: [3, 4, 5],
  },
  8: {
    top: [0, 1, 2],
    middle: [7, 3],
    bottom: [4, 5, 6],
  },
  9: {
    top: [0, 1, 2],
    middle: [8, 3],
    bottom: [4, 5, 6, 7],
  },
  10: {
    top: [0, 1, 2, 3],
    middle: [9, 4],
    bottom: [5, 6, 7, 8],
  },
};

const DedicatedScreen = props => {
  const { gameState } = props;
  const seatingArrangement = seatingArrangementChart[gameState.players.length];
  return (
    <div style={style.screen}>
      <div style={style.screenTopArea}>
        <p>Players:</p>
        <p>
          [
          {gameState.players
            .map(socketId => gameState.users[socketId])
            .join(', ')}
          ]
        </p>
        <p>
          {!gameState.winner
            ? 'Game in progress...'
            : gameState.winner === 'res'
            ? 'Resistance wins!'
            : 'Spies win!'}
        </p>
        <p>Current phase: {gameState.currentPhase}</p>
      </div>
      <div style={style.screenMainArea}>
        <div style={style.screenTopLine}>
          {seatingArrangement.top.map((n, i) => (
            <Avatar
              key={i}
              playerNum={n}
              gameState={gameState}
              userName={gameState.users[gameState.players[n]]}
            />
          ))}
        </div>
        <div style={style.screenMiddleLine}>
          <Avatar
            playerNum={seatingArrangement.middle[0]}
            gameState={gameState}
            userName={gameState.users[gameState.players[seatingArrangement.middle[0]]]}
          />
          <MissionInfo gameState={gameState} />
          <Avatar
            playerNum={seatingArrangement.middle[1]}
            gameState={gameState}
            userName={gameState.users[gameState.players[seatingArrangement.middle[1]]]}
          />
        </div>
        <div style={style.screenBottomLine}>
          {seatingArrangement.bottom.map((n, i) => (
            <Avatar
              key={i}
              playerNum={n}
              gameState={gameState}
              userName={gameState.users[gameState.players[n]]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DedicatedScreen;