import React from 'react';
import style from './style';

import Avatar from './avatar';

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
  const gameState = props.gameState;
  const seatingArrangement = seatingArrangementChart[gameState.players.length];
  return (
    <div style={style.screen}>
      <div style={style.screenTopArea}>
      </div>
      <div style={style.screenMainArea}>
        <div style={style.screenTopLine}>
          {seatingArrangement.top.map((n, i) => (
            <Avatar
              key={i}
              userName={gameState.users[gameState.players[n]]}
            />
          ))}
        </div>
        <div style={style.screenMiddleLine}>
          <Avatar
            userName={gameState.users[gameState.players[seatingArrangement.middle[0]]]}
          />
          <div style={style.screenMissionInfo}>
                        
          </div>
          <Avatar
            userName={gameState.users[gameState.players[seatingArrangement.middle[1]]]}
          />
        </div>
        <div style={style.screenBottomLine}>
          {seatingArrangement.bottom.map((n, i) => (
            <Avatar
              key={i}
              userName={gameState.users[gameState.players[n]]}
            />
          ))}
        </div>
      </div>

      {/* <p>Successes: {gameState.successes}, Failures: {gameState.failures}</p>
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
      <p>Current mission: {gameState.currentMission + 1}</p>
      <p>Reject tracker: {gameState.rejectTracker}</p>
      <p>Current leader: {gameState.users[gameState.players[gameState.currentLeader]]}</p>
      {!!Object.keys(gameState.proposedTeam).length && (
        <React.Fragment>
          <p>Proposed Team:</p>
          <p>
            [
            {Object.keys(gameState.proposedTeam)
              .map(socketId => gameState.users[socketId])
              .join(', ')}
            ]
          </p>
        </React.Fragment>
      )}
      {gameState.resultOfVotes.map(vote => (
        <p>{vote}</p>
      ))} */}

    </div>
  );
};

export default DedicatedScreen;