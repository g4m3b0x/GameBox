import React from 'react';
import socket from '../../../index.js';
import style from './style';

function submitMissionVote(castedVote) {
  socket.emit('submitMissionVote', castedVote);
}

const MissionInput = props => {
  const gameState = props.gameState;
  return gameState.activePlayers[socket.id] ? (
    !(socket.id in gameState.missionVotes) ? (
      <React.Fragment>
        <p>Complete mission?</p>
        <img
          style={style.missionVoteButton}
          src={'/resistance_mission_success.png'}
          onClick={() => submitMissionVote(true)}
        />
        {socket.id in gameState.spies &&
          <img
            style={style.missionVoteButton}
            src={'/resistance_mission_fail.png'}
            onClick={() => submitMissionVote(false)}
          />
        }
      </React.Fragment>
    ) : (
      <p>Waiting for remaining team members...</p>
    )
  ) : (
    <p>Waiting for team members to complete mission...</p>
  );
};

export default MissionInput;