import React from 'react';
import style from './style';

const MissionInfo = props => {
  const { gameState } = props;
  return (
    <div style={style.screenMissionInfo}>
      <div style={style.screenMissionTracker}>
        {gameState.missionResults.map((result, i) => (
          <div style={style.screenMissionItem}>
            {result === 0 ? (
              <img
                key={i}
                style={style.screenMissionToken}
                src={'/resistance_token_failure.png'}
              />
            ) : result === 1 ? (
              <img
                key={i}
                style={style.screenMissionToken}
                src={'/resistance_token_success.png'}
              />
            ) : (
              <div
                key={i}
                style={style.screenMissionNumber}
              >
                {gameState.groupSize.missionSize[i]}
              </div>
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
          Rejections: {gameState.rejectTracker}
        </p>
      </div>
    </div>
  );
};

export default MissionInfo;