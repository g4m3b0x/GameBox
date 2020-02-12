import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

import DedicatedScreen from './dedicatedScreen';
import Instructions from './instructions';
import PlayerList from './playerList';

export default class Resistance extends Component {
  constructor() {
    super();
    this.state = {
      groupSize: {},
      users: {},
      dedicatedScreen: null,
      players: [],
      winner: null,
      res: {},
      spies: {},
      specialRoles: {},
      currentMission: 0,
      currentPhase: null,
      activePlayers: {},
      proposedTeam: {},
      currentVotes: {},
      voting: false,
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
    socket.on('setVoteStatus', data => {
      if (this._isMounted) this.setState(data);
    });
    socket.on('proposedTeam', data => {
      if (this._isMounted) this.setState(data);
    });
    socket.on('updateVote', data => {
      const { socketId, castedVote } = data;
      if (this._isMounted) this.setState({
        currentVotes: {
          ...this.state.currentVotes,
          [socketId]: castedVote,
        }
      });
    })
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
          <div>
            <div>
              <p>MISSION {this.state.currentMission + 1}</p>
            </div>
            <div>
            {this.state.currentPhase === 'teamSelection' && (
              <p>Current leader: {this.state.users[Object.keys(this.state.activePlayers)[0]]}</p>
            )}
            </div>
          </div>
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
            <Instructions
              groupSize={this.state.groupSize}
              currentMission={this.state.currentMission}
              activePlayers={this.state.activePlayers}
              users={this.state.users}
              players={this.state.players}
              currentPhase={this.state.currentPhase}
              proposedTeam={this.state.proposedTeam}
              currentVotes={this.state.currentVotes}
              voting={this.state.voting}
            />
            <PlayerList
              activePlayers={this.state.activePlayers}
              users={this.state.users}
              players={this.state.players}
              res={this.state.res}
              spies={this.state.spies}
              specialRoles={this.state.specialRoles}
              currentPhase={this.state.currentPhase}
              proposedTeam={this.state.proposedTeam}
              currentVotes={this.state.currentVotes}
              voting={this.state.voting}
            />
          </div>
        </div>
      </div>
    );
  }
}
