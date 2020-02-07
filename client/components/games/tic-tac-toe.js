import React, { Component } from 'react';
import socket from '../../index.js';

export default class TicTacToe extends Component {
  constructor() {
    super();
    this.state = {
      users: {},
      dedicatedScreen: null,
      gameBoard: [[]],
      turn: 0,
      winner: null
    };
    this._isMounted = false; // prevent memory leak
    this.move = this.move.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (socket.hostBool) {
      // done once, by the host
      socket.emit('gameDataReducer', {
        request: 'getInitGameState'
      });
    }
    socket.on('sendGameState', data => {
      if (this._isMounted) this.setState(data);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  move(x, y) {
    socket.emit('gameDataReducer', {
      request: 'sendMove',
      payload: { x, y }
    });
  }

  returnToLobby() {
    socket.emit('routesReducer', {
      request: 'returnToLobby'
    });
  }

  render() {
    return (
      <div>
        {!this.state.winner ? (
          <div>
            <div>
              <p>{Object.values(this.state.users)[this.state.turn]}'s turn:</p>
            </div>
            <div style={styleTable}>
              {this.state.gameBoard.map((row, y) => (
                <div key={y} style={styleRow}>
                  {this.state.gameBoard[y].map((col, x) => (
                    <div key={x} style={styleCell}>
                      <div
                        style={styleCellDiv}
                        onClick={() => {
                          this.move(x, y);
                        }}
                      >
                        {this.state.gameBoard[y][x]}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p>
              {this.state.winner === -1
                ? 'Draw!'
                : `${this.state.winner} wins!`}
            </p>
            <button onClick={this.returnToLobby}> Back to Lobby</button>
          </div>
        )}
      </div>
    );
  }
}

// IN-LINE STYLES:

const styleTable = {
  height: '45vh',
  width: '45vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const styleRow = {
  height: '30%',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between'
};

const styleCell = {
  height: '100%',
  width: '30%'
};

const styleCellDiv = {
  height: '100%',
  width: '100%',
  fontSize: '3em',
  borderRadius: '0.5em',
  border: '2px solid blue',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};
