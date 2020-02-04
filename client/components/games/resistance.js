import React, { Component } from 'react';
import socket from '../../index.js';

export default class Resistance extends Component {
  constructor() {
    super();
    this.state = {
      res: [],
      spies: [],
      winner: null,
    };
    this._isMounted = false;      // prevent memory leak
    // this.move = this.move.bind(this);
    this.returnToLobby = this.returnToLobby.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (socket.hostBool) {    // this should only be done once, so we make the host do it
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

  // move(x, y) {
  //   socket.emit('game data reducer', {
  //     request: 'send move',
  //     payload: {x, y},
  //   })
  // }

  returnToLobby() {
    socket.emit('routes reducer', {
      request: 'return to lobby'
    });
  }

  render() {
    console.log(
      'RES:', this.state.res,
      'SPIES:', this.state.spies,
    )
    return (
      <div>
        {!this.state.winner ? (
          <div>
            {this.state.spies.includes(socket.id) ? 'YOU ARE A SPY' : 'YOU ARE RESISTANCE'}
          </div>
        ) : (
          <div>
            <p>{this.state.winner === -1 ? 'Draw!' : `${this.state.winner} wins!`}</p>
            <button onClick={this.returnToLobby}> Back to Lobby</button>
          </div>
        )}
      </div>
    );
  }
}

// IN-LINE STYLES: