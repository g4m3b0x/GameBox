import React, { Component } from 'react';
import socket from '../../index.js';
import Voting from './voting';
export default class Resistance extends Component {
  constructor() {
    super();
    this.state = {
      users: {},
      dedicatedScreen: null,
      res: {},
      spies: {},
      winner: null,
      currentPhase: null,
      activePlayers: {}
    };
    this._isMounted = false; // prevent memory leak
    // this.move = this.move.bind(this);
    this.returnToLobby = this.returnToLobby.bind(this);
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

  // move(x, y) {
  //   socket.emit('gameDataReducer', {
  //     request: 'send move',
  //     payload: { x, y }
  //   });
  // }

  returnToLobby() {
    socket.emit('routesReducer', {
      request: 'returnToLobby'
    });
  }

  render() {
    if (this.state.dedicatedScreen === socket.id) {
      return <div>{'THIS IS THE DEDICATED SCREEN'}</div>;
    } else {
      return (
        <div>
          {socket.id in this.state.spies
            ? 'YOU ARE A SPY'
            : 'YOU ARE RESISTANCE'}
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src="resistance_back.png" />
              </div>
              <div className="flip-card-back">
                <img
                  src={
                    socket.id in this.state.spies
                      ? this.state.spies[socket.id]
                      : this.state.res[socket.id]
                  }
                />
              </div>
            </div>
          </div>
          <Voting
            activePlayers={this.state.activePlayers}
            users={this.state.users}
          />
        </div>
      );
    }
  }
}

// IN-LINE STYLES:
