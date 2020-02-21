import React from 'react';
import socket from '../../../index.js';
import style from './style';

import { writeGameState } from '../functions';

const roles = {
  'commander': 'Commander',
  'assassin': 'Assassin',
  'bodyguard': 'Bodyguard',
  'falseCommander': 'False Commander',
  'deepCover': 'Deep Cover',
  'blindSpy': 'Blind Spy',
};
const res = ['commander', 'bodyguard'];

const ChooseRoles = props => {
  const { gameState } = props;
  return (
    <div style={style.chooseRoles}>
      <p>{gameState.users[gameState.players[0]]} is choosing roles...</p>
      {Object.keys(roles).map((role, i) => (
        <div key={i} style={style.chooseRolesItem}>
          <button
            style={res.includes(role) ? style.chooseRolesBlue : style.chooseRolesRed}
            disabled={!socket.hostBool}
            onClick={() => writeGameState('toggleRole', { role })}
          >
            {roles[role]}
          </button>
          {gameState.specialRoles[role] &&
            <img
              style={style.chooseRolesCheck}
              src="/resistance_token_approve.png"
            />
          }
        </div>
      ))}
      <button
        disabled={!socket.hostBool}
        onClick={() => writeGameState('startGame')}
      >
        Start Game
      </button>
    </div>
  );
}

export default ChooseRoles;