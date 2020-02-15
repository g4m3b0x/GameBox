import React from 'react';
import style from './style';

const Avatar = props => {
  const {playerNum, gameState} = props;
  const user = gameState.players[playerNum];
  return (
    <div style={style.screenPlayer}>
      <div style={style.screenPlayerAvatarArea}>
        <img src="resistance_avatar.png" style={style.screenPlayerImage} />
        <p style={style.screenPlayerName}>{gameState.users[user]}</p>
      </div>
      <div style={style.screenPlayerTokenArea}>
        {user === gameState.players[gameState.currentLeader] &&
          <img
            style={style.screenPlayerLeaderToken}
            src={'/resistance_token_leader.png'}
          />
        }
        {user in gameState.proposedTeam &&
          <img
            style={style.screenPlayerGunToken}
            src={'/resistance_token_gun1.png'}
          />
        }
        {user in gameState.teamVotes &&
          <img
            style={style.screenPlayerVoteToken}
            src={'/resistance_token_back.png'}
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