import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

export default class Resistance extends Component {
  constructor() {
    super();
    this.state = {
      users: {},
      dedicatedScreen: null,
      res: {},
      spies: {},
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
        <div style={style.view}>
          <div style={style.statusBar}>
            <p>GENERIC STATUS MESSAGE</p>
          </div>
          <div style={style.belowStatusBar}>
            <div style={style.cardArea}>
              <div style={style.cardAreaBuffer} />
              <div className="flip-card" style={style.flipCard}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <img style={style.card} src="resistance_back.png" />
                  </div>
                  <div className="flip-card-back">
                    <img
                      style={style.card}
                      src={socket.id in this.state.spies
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
              <div style={style.instructions}>
                <p>Generic Instruction</p>
              </div>
              <div style={style.information}>
                <p>--Filler Information--</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}