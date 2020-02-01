import React, { Component } from 'react';
import socket from '../index.js';

export default class TicTac extends Component {
  constructor() {
    super();
    this.state = { gameBoard: [[]], winner: null };
    this.move = this.move.bind(this);
    this.returnToLobby = this.returnToLobby.bind(this);
  }

  componentDidMount() {
    if (socket.hostBool) {    // this should only be done once, so we make the host do it
      // socket.emit('set initial game state');
      socket.emit('request data from server', {
        request: 'get initial game state'
      });
    }
    socket.on('send game state', data => {
      this.setState(data);
    });
  }

  // NEED TO LOOK INTO HOW TO UNSUBSCRIBE EVENT LISTENERS
  // TO PREVENT MEMORY LEAK.
  // componentWillUnmount() {
  //   socket.removeAllListeners();
  // }

  move(x, y) {
    // const coord = { x, y };
    // socket.emit('move', coord);
    socket.emit('request data from server', {
      request: 'send move',
      payload: {x, y},
    })
  }

  returnToLobby() {
    socket.emit('return to lobby');
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
            <button onClick={this.returnToLobby}> Back to Lobby</button>
          </div>
        )}
      </div>
    );
  }
}
