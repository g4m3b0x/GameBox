import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

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
            <div style={style.topArea}>
              <button className="tiny-button" onClick={this.returnToLobby}>Back to Lobby</button>
              <p style={{ width: '100%' }}>{Object.values(this.state.users)[this.state.turn]}'s turn:</p>
            </div>
            <div style={style.table}>
              {this.state.gameBoard.map((row, y) => (
                <div key={y} style={style.row}>
                  {this.state.gameBoard[y].map((col, x) => (
                    <div key={x} style={style.cell}>
                      <div
                        style={style.cellDiv}
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
            <button onClick={this.returnToLobby}>Back to Lobby</button>
          </div>
        )}
      </div>
    );
  }
}