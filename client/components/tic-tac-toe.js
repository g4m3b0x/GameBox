import React, { Component } from 'react';
import socket from '../index.js';

export default class TicTac extends Component {
  constructor(props) {
    super(props);
    this.state = { gameBoard: [[]] };
    this.move = this.move.bind(this);
  }

  componentDidMount() {
    if (socket.hostBool) {
      socket.emit('initalState');
    }
    socket.on('sendState', data => {
      console.log(data);
      this.setState({ gameBoard: data });
    });
  }
  move(x, y) {
    const coord = { x, y };
    socket.emit('move', coord);
  }

  render() {
    return (
      <div>
        {this.state.gameBoard.map((grid, x) => (
          <ol>
            {grid.map((elm, y) => (
              <button onClick={() => this.move(x, y)}> {elm}</button>
            ))}
          </ol>
        ))}
      </div>
    );
  }
}
