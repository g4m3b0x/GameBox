import React from 'react';
import socket from '../../../index.js';
import style from './style';

function startVote() {
  socket.emit('startVote');
}
function submitVote(castedVote) {
  socket.emit('submitVote', castedVote);
}

const TeamSelectionInput = props => {
  return (
    <div style={style.instructionsArea}>
      {props.voting ? (
        !(socket.id in props.teamVotes) ? (
          <React.Fragment>
            <p>Approve team?</p>
            <img
              style={style.approveButton}
              src={'/resistance_token_approve.png'}
              onClick={() => submitVote(true)}
            />
            <img
              style={style.approveButton}
              src={'/resistance_token_reject.png'}
              onClick={() => submitVote(false)}
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
            onClick={startVote}
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
      )}
    </div>
  );
}

export default TeamSelectionInput;