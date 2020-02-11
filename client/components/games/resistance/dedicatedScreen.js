import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

export default class Voting extends Component {
  constructor() {
    super();
    this.state = {
      users: {},
      dedicatedScreen: null,
      players: [],
      winner: null,
      res: {},
      spies: {},
      currentMission: 0,
      rejectTracker: 0,
      currentLeader: 0,
      currentPhase: null,
      proposedTeam: {},
      activePlayers: {}
    };
    this._isMounted = false; // prevent memory leak
  }

  componentDidMount() {
    this._isMounted = true;
    socket.emit('gameDataReducer', {
      request: 'getInitGameState'
    });
    socket.on('sendGameState', data => {
      if (this._isMounted) this.setState(data);
    });
    socket.on('proposedTeam', data => {
      if (this._isMounted) this.setState(data);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div style={style.screen}>
        <p>Players:</p>
        <p>[{this.state.players.map(socketId => this.state.users[socketId]).join(', ')}]</p>
        <p>{!this.state.winner ? 'Game in progress...' : this.state.winner === 'res' ? 'Resistance wins!' : 'Spies win!' }</p>
        <p>Current phase: {this.state.currentPhase}</p>
        {!!Object.keys(this.state.proposedTeam).length && (
          <React.Fragment>
            <p>Proposed Team:</p>
            <p>[{Object.keys(this.state.proposedTeam).map(socketId => this.state.users[socketId]).join(', ')}]</p>
          </React.Fragment>
        )}
      </div>
    );
  }
}
