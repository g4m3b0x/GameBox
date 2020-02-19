import React from 'react';
import socket from '../../../index.js';
import style from './style';

function toggleRole(role) {
  socket.emit('toggleRole', role);
}

function startGame() {
  socket.emit('startGame');
}

const ChooseRoles = props => {
  const { gameState } = props;
  return (
    <div style={style.chooseRoles}>
      <p>{gameState.users[gameState.players[0]]} is choosing roles...</p>
      <div style={style.chooseRolesItem}>
        <button
          style={style.chooseRolesBlue}
          disabled={!socket.hostBool}
          onClick={() => toggleRole('commander')}
        >
          Commander
        </button>
        {gameState.commander &&
          <img
            style={style.chooseRolesCheck}
            src="/resistance_token_approve.png"
          />
        }
      </div>
      <div style={style.chooseRolesItem}>
        <button
          style={style.chooseRolesRed}
          disabled={!socket.hostBool}
          onClick={() => toggleRole('assassin')}
        >
          Assassin
        </button>
        {gameState.assassin &&
          <img
            style={style.chooseRolesCheck}
            src="/resistance_token_approve.png"
          />
        }
      </div>
      <div style={style.chooseRolesItem}>
        <button
          style={style.chooseRolesBlue}
          disabled={!socket.hostBool}
          onClick={() => toggleRole('bodyguard')}
        >
          Bodyguard
        </button>
        {gameState.bodyguard &&
          <img
            style={style.chooseRolesCheck}
            src="/resistance_token_approve.png"
          />
        }
      </div>
      <div style={style.chooseRolesItem}>
        <button
          style={style.chooseRolesRed}
          disabled={!socket.hostBool}
          onClick={() => toggleRole('falseCommander')}
        >
          False Commander
        </button>
        {gameState.falseCommander &&
          <img
            style={style.chooseRolesCheck}
            src="/resistance_token_approve.png"
          />
        }
      </div>
      <div style={style.chooseRolesItem}>
        <button
          style={style.chooseRolesRed}
          disabled={!socket.hostBool}
          onClick={() => toggleRole('deepCover')}
        >
          Deep Cover
        </button>
        {gameState.deepCover &&
          <img
            style={style.chooseRolesCheck}
            src="/resistance_token_approve.png"
          />
        }
      </div>
      <div style={style.chooseRolesItem}>
        <button
          style={style.chooseRolesRed}
          disabled={!socket.hostBool}
          onClick={() => toggleRole('blindSpy')}
        >
          Blind Spy
        </button>
        {gameState.blindSpy &&
          <img
            style={style.chooseRolesCheck}
            src="/resistance_token_approve.png"
          />
        }
      </div>
      <button
        disabled={!socket.hostBool}
        onClick={startGame}
      >
        Start Game
      </button>
    </div>
  );
}

export default ChooseRoles;