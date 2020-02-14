import React from 'react';
import socket from '../../../index.js';
import style from './style';

const CardArea = props => {
  const gameState = props.gameState;
  return (
    <div style={style.cardArea}>
      <div style={style.cardAreaBuffer} />
      <div className="flip-card" style={style.flipCard}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <img style={style.card} src="resistance_char_back.png" />
          </div>
          <div className="flip-card-back">
            <img
              style={style.card}
              src={
                socket.id in gameState.spies
                  ? gameState.spies[socket.id]
                  : gameState.res[socket.id]
              }
            />
          </div>
        </div>
      </div>
      <div style={style.cardAreaBuffer} />
    </div>
  );
};

export default CardArea;