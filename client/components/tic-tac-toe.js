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

  // NEED TO LOOK INTO HOW TO UNSUBSCRIBE EVENT LISTENERS
  // TO PREVENT MEMORY LEAK.
  // componentWillUnmount() {
  //   socket.removeAllListeners();
  // }

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
        {!this.state.winner ? (
          this.state.gameBoard.map((row, y) => (
            <div key={y} className="gridRow">
              {row.map((elm, x) => (
                <button key={x} onClick={() => {
                  this.move(x, y);
                }}>{elm}</button>
              ))}
            </div>
          ))
        ) : (
          <div>
            <p>{this.state.winner} wins!</p>
            <button onClick={this.lobby}> Back to Lobby</button>
          </div>
        )}
      </div>
    );
  }
}
