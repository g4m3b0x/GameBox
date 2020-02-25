import React from 'react';
import socket from '../../../index.js';
import style from './style';

import { writeGameState } from '../functions';

const MissionInput = props => {
  const { gameState } = props;
  return gameState.proposedTeam[socket.id] ? (
    !(socket.id in gameState.missionVotes) ? (
      <React.Fragment>
        <p>Complete mission?</p>
        <img
          style={style.missionVoteButton}
          src={'/resistance_mission_success.png'}
          onClick={() =>
            writeGameState('submitMissionVote', { castedVote: true })
          }
        />
        {socket.id in gameState.spies && (
          <img
            style={style.missionVoteButton}
            src={'/resistance_mission_fail.png'}
            onClick={() =>
              writeGameState('submitMissionVote', { castedVote: false })
            }
          />
        )}
      </React.Fragment>
    ) : (
      <p>Waiting for remaining team members...</p>
    )
  ) : (
    <p>Waiting for team members to complete mission...</p>
  );
};

export default MissionInput;
