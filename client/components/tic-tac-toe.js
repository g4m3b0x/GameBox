import React, { Component } from 'react';
import socket from '../index.js';

export default class TicTac extends Component {
  constructor() {
    super();
    this.state = { gameBoard: [[]], winner: null };
    this.move = this.move.bind(this);
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

  render() {
    return (
      <div>
        {this.state.winner ? (
          <p>{this.state.winner} wins</p>
        ) : (
          this.state.gameBoard.map((grid, x) => (
            <ol>
              {grid.map((elm, y) => (
                <button onClick={() => this.move(x, y)}> {elm}</button>
              ))}
            </ol>
          ))
        )}
      </div>
    );
  }
}
