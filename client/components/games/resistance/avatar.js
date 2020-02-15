import React from 'react';
import style from './style';

const Avatar = props => {
  return (
    <div style={style.screenPlayer}>
      <img src="resistance_avatar.png" style={style.screenPlayerImage} />
      <p style={style.screenPlayerName}>{props.userName}</p>
    </div>
  );
};

export default Avatar;