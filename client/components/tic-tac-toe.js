import React, { Component } from 'react';
import socket from '../index.js';

export default class TicTac extends Component {
  constructor() {
    super();
    this.state = { gameBoard: [[]], winner: null };
    this._isMounted = false;      // prevent memory leak
    this.move = this.move.bind(this);
    this.returnToLobby = this.returnToLobby.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (socket.hostBool) {    // this should only be done once, so we make the host do it
      // socket.emit('request data from server', {
      socket.emit('game data reducer', {
        request: 'get initial game state'
      });
    }
    socket.on('send game state', data => {
      if (this._isMounted) this.setState(data);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  move(x, y) {
    // socket.emit('request data from server', {
    socket.emit('game data reducer', {
      request: 'send move',
      payload: {x, y},
    })
  }

  returnToLobby() {
    // socket.emit('return to lobby');
    socket.emit('routes reducer', {
      request: 'return to lobby'
    });
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
