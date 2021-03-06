import React from 'react';
import socket from '../../../index.js';
import style from './style';

import { writeGameState } from '../functions';

function handleClick(currentPhase, voting, leaderId, assassinId, assassinatedId, playerId) {
  if (currentPhase === 'teamSelection' && !voting && socket.id === leaderId) {
    writeGameState('togglePlayer', { playerId });
  }
  if (currentPhase === 'assassination' && socket.id === assassinId && !assassinatedId) {
    writeGameState('assassinatePlayer', { playerId });
  }
}

const PlayerList = props => {
  const { gameState } = props;
  return (
    <div style={style.playerListArea}>
      {gameState.players.map((user, i) => (
        <div key={i} style={style.playerListItem}>
          <div style={style.playerTokenArea}>
            {gameState.players
              && user === gameState.players[gameState.currentLeader] &&
              <img
                style={style.playerToken}
                src={'/resistance_token_leader.png'}
              />
            }
          </div>
          <div style={style.playerTokenArea}>
            {gameState.currentPhase === 'teamSelection'
              && gameState.voting && user in gameState.teamVotes &&
              <img
                style={style.playerToken}
                src={
                  user !== socket.id
                    ? '/resistance_token_back.png'
                    : gameState.teamVotes[user]
                    ? '/resistance_token_approve.png'
                    : '/resistance_token_reject.png'
                }
              />
            }
            {gameState.currentPhase === 'voteReveal' &&
              <img
                style={style.playerToken}
                src={
                  gameState.teamVotes[user]
                    ? '/resistance_token_approve.png'
                    : '/resistance_token_reject.png'
                }
              />
            }
            {gameState.currentPhase === 'mission'
              && gameState.missionVotes && user in gameState.missionVotes &&
              <img
                style={style.playerToken}
                src={
                  user !== socket.id
                    ? '/resistance_mission_back.png'
                    : gameState.missionVotes[user]
                    ? '/resistance_mission_success.png'
                    : '/resistance_mission_fail.png'
                }
              />
            }
          </div>
          <button
            style={
              user === socket.id || gameState.currentPhase === 'assassination'
                ? user in gameState.res
                  ? style.playerBlue
                  : style.playerRed
                : socket.id === gameState.specialRoles.bodyguard && (user === gameState.specialRoles.commander || user === gameState.specialRoles.falseCommander)
                  ? style.playerPurple
                  : (socket.id in gameState.res && socket.id !== gameState.specialRoles.commander)
                    || socket.id === gameState.specialRoles.blindSpy
                      ? style.playerGray
                      : user in gameState.res
                        || (user === gameState.specialRoles.deepCover && socket.id === gameState.specialRoles.commander)
                        || (user === gameState.specialRoles.blindSpy && socket.id in gameState.spies && user !== socket.id)
                          ? style.playerBlue
                          : style.playerRed
            }
            onClick={() => handleClick(
              gameState.currentPhase,
              gameState.voting,
              gameState.players[gameState.currentLeader],
              gameState.specialRoles.assassin,
              gameState.assassinated,
              user
            )}
          >
            <p style={style.playerName}>{gameState.users[user]}</p>
          </button>
          {user in gameState.proposedTeam &&
            <img
              style={style.gunImage}
              src={gameState.proposedTeam[user]}
            />
          }
        </div>
      ))}
    </div>
  );
};

export default PlayerList;