import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

import DedicatedScreen from './dedicatedScreen';
import BackToLobby from '../backToLobby';
import StatusBar from './statusBar';
import TeamSelectionInput from './teamSelectionInput';
import MissionInput from './missionInput';
import PlayerList from './playerList';
import CardArea from './cardArea';

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
      currentLeader: 0,
      currentPhase: null,
      voting: false,
      proposedTeam: {},
      teamVotes: {},
      missionVotes: {},
      missionResults: [],
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
    socket.on('updateTeamVote', data => {
      const { socketId, castedVote } = data;
      if (this._isMounted)
        this.setState({
          teamVotes: {
            ...this.state.teamVotes,
            [socketId]: castedVote
          }
        });
    });
    socket.on('updateMissionVote', data => {
      const { socketId, castedVote } = data;
      if (this._isMounted)
        this.setState({
          missionVotes: {
            ...this.state.missionVotes,
            [socketId]: castedVote
          }
        });
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
      return <DedicatedScreen gameState={this.state} />;
    }
    return (
      <div style={style.view}>
        <div style={style.topArea}>
          {socket.hostBool &&
            <BackToLobby />
          }
          <StatusBar gameState={this.state} />
          <div style={style.instructions}>
            {this.state.currentPhase === 'teamSelection' ? (
              <TeamSelectionInput gameState={this.state} />
            ) : (
              <MissionInput gameState={this.state} />
            )}
          </div>
        </div>
        <div style={style.bottomArea}>
          <PlayerList gameState={this.state} />
          <CardArea gameState={this.state} />
        </div>
      </div>
    );
  }
}
