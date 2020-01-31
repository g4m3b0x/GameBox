import React, { Component } from 'react';
import socket from '../index.js';

export default class TicTac extends Component {
  constructor() {
    super();
    this.state = { gameBoard: [[]], winner: null };
    this.move = this.move.bind(this);
    this.lobby = this.lobby.bind(this);
  }

  componentDidMount() {
    if (socket.hostBool) {
      socket.emit('initialState');
    }
    socket.on('sendState', data => {
      this.setState(data);
    });
  }
  move(x, y) {
    const coord = { x, y };
    socket.emit('move', coord);
  }
  lobby() {
    socket.emit('setStatus', 'in lobby');
  }
  render() {
    return (
      <div>
        {this.state.winner ? (
          <div>
            <p>{this.state.winner} wins</p>
            <button onClick={this.lobby}> Back to Lobby</button>
          </div>
        ) : (
          this.state.gameBoard.map((grid, x) => (
            <ol>
              {grid.map((elm, y) => (
                <button onClick={() => this.move(x, y)}>{elm}</button>
              ))}
            </ol>
          ))
        )}
      </div>
    );
  }
}
