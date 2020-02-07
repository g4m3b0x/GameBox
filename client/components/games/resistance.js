import React, { Component } from 'react';
import socket from '../../index.js';

export default class Resistance extends Component {
  constructor() {
    super();
    this.state = {
      users: {},
      dedicatedScreen: null,
      res: [],
      spies: [],
      winner: null
    };
    this._isMounted = false;  // prevent memory leak
    // this.move = this.move.bind(this);
    this.returnToLobby = this.returnToLobby.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (socket.hostBool) {    // done once, by the host
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

  // move(x, y) {
  //   socket.emit('gameDataReducer', {
  //     request: 'send move',
  //     payload: {x, y},
  //   })
  // }

  returnToLobby() {
    socket.emit('routesReducer', {
      request: 'returnToLobby'
    });
  }

  render() {
    if (this.state.dedicatedScreen === socket.id) {
      return (
        <div>
          {'THIS IS THE DEDICATED SCREEN'}
        </div>
      )
    } else {
      return (
        <div>
          {this.state.spies.includes(socket.id)
            ? 'YOU ARE A SPY'
            : 'YOU ARE RESISTANCE'}
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="resistance_char_res1.png" />
              </div>
              <div className="flip-card-back">
                <img src="resistance_char_res1.png" />
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

// IN-LINE STYLES:
