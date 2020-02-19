import React from 'react';
import style from './style';

const MissionInfo = props => {
  const { gameState } = props;
  return (
    <div style={style.screenMissionInfo}>
      <div style={style.screenMissionTracker}>
        {gameState.missionResults.map((result, i) => (
          <div key={i} style={style.screenMissionItem}>
            {result === 0 ? (
              <img
                style={style.screenMissionToken}
                src={'/resistance_token_failure.png'}
              />
            ) : result === 1 ? (
              <img
                style={style.screenMissionToken}
                src={'/resistance_token_success.png'}
              />
            ) : (
              <p>{gameState.groupSize.missionSize[i]}</p>
            )}
            {(gameState.players.length >= 7 && i === 3 &&
              <p style={{ fontSize: '0.2em' }}>Needs 2 fails</p>
            )}
          </div>
        ))}
      </div>
      <div style={style.screenRejectTracker}>
        <p
          style={{ color: gameState.rejectTracker >= 4 ? 'red' : 'black' }}
        >
          Rejections: {gameState.rejectTracker} / 5
        </p>
      </div>
    </div>
  );
};

export default MissionInfo;