import React from 'react';
import style from './style';

const Avatar = props => {
  const { playerNum, gameState } = props;
  const user = gameState.players[playerNum];
  return (
    <div style={style.screenPlayer}>
      <div style={style.screenPlayerAvatarArea}>
        <img
          src={
            !gameState.winner ? 'resistance_avatar.png'
            : user in gameState.spies
            ? gameState.spies[user]
            : gameState.res[user]
          }
          style={style.screenPlayerImage}
        />
        <p style={style.screenPlayerName}>{gameState.users[user]}</p>
        {user === gameState.players[gameState.currentLeader] &&
          <img
            style={style.screenPlayerLeaderToken}
            src={'/resistance_token_leader.png'}
          />
        }
      </div>
      <div style={style.screenPlayerTokenArea}>
        {user in gameState.proposedTeam &&
          <img
            style={style.screenPlayerGunToken}
            src={gameState.proposedTeam[user]}
          />
        }
        {gameState.currentPhase === 'teamSelection'
          && user in gameState.teamVotes &&
          <img
            style={style.screenPlayerVoteToken}
            src={'/resistance_token_back.png'}
          />
        }
        {gameState.currentPhase === 'voteReveal' &&
          <img
            style={style.screenPlayerVoteToken}
            src={
              gameState.teamVotes[user]
                ? '/resistance_token_approve.png'
                : '/resistance_token_reject.png'
            }
          />
        }
        {user in gameState.missionVotes &&
          <img
            style={style.screenPlayerMissionToken}
            src={'/resistance_mission_back.png'}
          />
        }
      </div>
    </div>
  );
};

export default Avatar;