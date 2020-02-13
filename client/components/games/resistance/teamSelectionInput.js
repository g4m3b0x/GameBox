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
  return props.voting ? (
    !(socket.id in props.teamVotes) ? (
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
  ) : props.activePlayers[socket.id] ? (
    <React.Fragment>
      <p>
        Choose a team of{' '}
        {
          props.groupSize[Object.keys(props.users).length]
            .missionSize[props.currentMission]
        }
        !
      </p>
      <button
        style={{ marginLeft: '0.5em' }}
        onClick={startTeamVote}
        disabled={
          Object.keys(props.proposedTeam).length !==
          props.groupSize[Object.keys(props.users).length]
            .missionSize[props.currentMission]
        }
      >
        Submit
      </button>
    </React.Fragment>
  ) : (
    <div>
      {Object.keys(props.groupSize).length && (
        <p>
          Waiting for{' '}
          {props.users[Object.keys(props.activePlayers)[0]]} to
          propose a team of{' '}
          {
            props.groupSize[Object.keys(props.users).length]
              .missionSize[props.currentMission]
          }
          ...
        </p>
      )}
    </div>
  );
}

export default TeamSelectionInput;