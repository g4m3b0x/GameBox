import React from 'react';
import socket from '../../../index.js';
import style from './style';

function setProposeTeam(currentPhase, activePlayers, id) {
  if (
    currentPhase !== 'teamSelection'
    || !(socket.id in activePlayers)
  ) return;
  socket.emit('proposingTeam', { id });
}

const PlayerList = props => {
  return (
    <div style={style.playerListArea}>
      {props.players.map((user, i) => (
        <div key={i} style={style.playerListItem}>
          <div style={style.playerVoteArea}>
            {props.currentPhase === 'teamSelection' && props.voting && user in props.teamVotes &&
              <img
                style={style.playerVoteToken}
                src={
                  user !== socket.id
                    ? '/resistance_token_back.png'
                    : props.teamVotes[user]
                    ? '/resistance_token_approve.png'
                    : '/resistance_token_reject.png'
                }
              />
            }
            {props.currentPhase === 'roundStart' && props.missionVotes && user in props.missionVotes &&
              <img
                style={style.playerVoteToken}
                src={
                  user !== socket.id
                    ? '/resistance_mission_back.png'
                    : props.missionVotes[user]
                    ? '/resistance_mission_success.png'
                    : '/resistance_mission_fail.png'
                }
              />
            }
          </div>
          <button
            style={
              user === socket.id
                ? socket.id in props.res
                  ? style.playerBlue
                  : style.playerRed
                : socket.id === props.specialRoles.bodyguard && (user === props.specialRoles.commander || user === props.specialRoles.falseCommander)
                  ? style.playerPurple
                  : (socket.id in props.res && socket.id !== props.specialRoles.commander)
                    || socket.id === props.specialRoles.blindSpy
                      ? style.playerGray
                      : user in props.res
                        || (user === props.specialRoles.deepCover && socket.id === props.specialRoles.commander)
                        || (user === props.specialRoles.blindSpy && socket.id in props.spies && user !== socket.id)
                          ? style.playerBlue
                          : style.playerRed
            }
            onClick={() => setProposeTeam(props.currentPhase, props.activePlayers, user)}
          >
            <p style={style.playerName}>{props.users[user]}</p>
          </button>
          {(props.currentPhase === 'teamSelection' || props.currentPhase === 'roundStart') && user in props.proposedTeam &&
            <img
              style={style.gunImage}
              src={props.proposedTeam[user]}
            />
          }
        </div>
      ))}
    </div>
  );
}

export default PlayerList;