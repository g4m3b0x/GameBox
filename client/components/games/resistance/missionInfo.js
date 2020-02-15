import React from 'react';
import style from './style';

const MissionInfo = props => {
  const { gameState } = props;
  return (
    <div style={style.screenMissionInfo}>
      <div style={style.screenMissionTracker}>
        {gameState.missionResults.map((result, i) => 
          result === 0 ? (
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
            <p>{gameState.groupSize.missionSize[i]}</p>
          )
        )}
      </div>

      <div style={style.screenRejectTracker}>
        <p>Rejections: {gameState.rejectTracker}</p>
      </div>

    </div>
  );
};

export default MissionInfo;