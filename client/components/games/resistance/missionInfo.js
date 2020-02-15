import React from 'react';
import style from './style';

const MissionInfo = props => {
  const { gameState } = props;
  return (
    <div style={style.screenMissionInfo}>
      <p>Mission results: {`[${gameState.missionResults.join(', ')}]`}</p>
      <p>Current mission: {gameState.currentMission + 1}</p>
      <p>Reject tracker: {gameState.rejectTracker}</p>
    </div>


    // {gameState.resultOfVotes.map(vote => (
    //   <p>{vote}</p>
    // ))}

  );
};

export default MissionInfo;