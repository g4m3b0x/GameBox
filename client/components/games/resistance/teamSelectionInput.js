import React from 'react';
import socket from '../../../index.js';
import style from './style';

function startTeamVote() {
  socket.emit('startTeamVote');
}
function submitTeamVote(castedVote) {
  socket.emit('submitTeamVote', castedVote);
}

const TeamSelectionInput = props => {
  const { gameState } = props;
  return gameState.voting ? (
    !(socket.id in gameState.teamVotes) ? (
      <React.Fragment>
        <p>Approve team?</p>
        <img
          style={style.teamVoteButton}
          src={'/resistance_token_approve.png'}
          onClick={() => submitTeamVote(true)}
        />
        <img
          style={style.teamVoteButton}
          src={'/resistance_token_reject.png'}
          onClick={() => submitTeamVote(false)}
        />
      </React.Fragment>
    ) : (
      <p>Waiting for remaining votes...</p>
    )
  ) : socket.id === gameState.players[gameState.currentLeader] ? (
    <React.Fragment>
      <p>
        Choose a team of{' '}
        {
          gameState.groupSize[gameState.players.length]
            .missionSize[gameState.currentMission]
        }
        !
      </p>
      <button
        style={style.genericButton}
        onClick={startTeamVote}
        disabled={
          Object.keys(gameState.proposedTeam).length !==
          gameState.groupSize[gameState.players.length]
            .missionSize[gameState.currentMission]
        }
      >
        Submit
      </button>
    </React.Fragment>
  ) : (
    <div>
      {Object.keys(gameState.groupSize).length && (
        <p>
          Waiting for{' '}
          {gameState.users[gameState.players[gameState.currentLeader]]} to
          propose a team of{' '}
          {
            gameState.groupSize[gameState.players.length]
              .missionSize[gameState.currentMission]
          }
          ...
        </p>
      )}
    </div>
  );
};

export default TeamSelectionInput;