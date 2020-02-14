import React from 'react';
// import socket from '../../../index.js';
import style from './style';

const DedicatedScreen = props => {
  const gameState = props.gameState;
  return (
    <div style={style.screen}>
      <p>Successes: {gameState.successes}</p>
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
      <p>Current leader: {gameState.users[gameState.players[gameState.currentLeader % gameState.players.length]]}</p>
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
      ))}
    </div>
  );
};

export default DedicatedScreen;