import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

import DedicatedScreen from './dedicatedScreen';
import Voting from './voting';

export default class Resistance extends Component {
  constructor() {
    super();
    this.state = {
      users: {},
      dedicatedScreen: null,
      players: [],
      winner: null,
      res: {},
      spies: {},
      currentPhase: null,
      activePlayers: {}
    };
    this._isMounted = false; // prevent memory leak
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

  returnToLobby() {
    socket.emit('routesReducer', {
      request: 'returnToLobby'
    });
  }

  render() {
    if (this.state.dedicatedScreen === socket.id) {
      return <DedicatedScreen />;
    }
    return (
      <div style={style.view}>
        <div style={style.statusBar}>
          <button onClick={this.returnToLobby}>Back to Lobby</button>
          <p>GENERIC STATUS MESSAGE</p>
        </div>
        <div style={style.belowStatusBar}>
          <div style={style.cardArea}>
            <div style={style.cardAreaBuffer} />
            <div className="flip-card" style={style.flipCard}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img style={style.card} src="resistance_char_back.png" />
                </div>
                <div className="flip-card-back">
                  <img
                    style={style.card}
                    src={
                      socket.id in this.state.spies
                        ? this.state.spies[socket.id]
                        : this.state.res[socket.id]
                    }
                  />
                </div>
              </div>
            </div>
            <div style={style.cardAreaBuffer} />
          </div>
          <div style={style.dynamicArea}>
            {this.state.currentPhase === 'teamSelection' ? (
              <Voting
                activePlayers={this.state.activePlayers}
                users={this.state.users}
                players={this.state.players}
              />
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
