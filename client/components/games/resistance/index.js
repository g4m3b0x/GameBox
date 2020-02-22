import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

import DedicatedScreen from './dedicatedScreen';
import BackToLobby from '../backToLobby';
import ChooseRoles from './chooseRoles';
import StatusBar from './statusBar';
import TeamSelectionInput from './teamSelectionInput';
import VoteRevealInput from './voteRevealInput';
import MissionInput from './missionInput';
import MissionRevealInput from './missionRevealInput';
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
      currentMission: null,
      currentLeader: null,
      currentPhase: null,
      voting: null,
      proposedTeam: {},
      teamVotes: {},
      missionVotes: {},
      missionResults: [],
    };
    this._isMounted = false; // prevent memory leak
  }

  componentDidMount() {
    this._isMounted = true;
    if (socket.hostBool) {
      // done once, by the host
      socket.emit('getGameState');
    }
    socket.on('sendGameState', data => {
      if (this._isMounted) this.setState(data);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (this.state.currentPhase === 'chooseRoles') {
      return <ChooseRoles gameState={this.state} />;
    } else if (this.state.dedicatedScreen === socket.id) {
      return <DedicatedScreen gameState={this.state} />;
    } else {
      return (
        <div style={style.view}>
          <div style={style.topArea}>
            <BackToLobby />
            {this.state.currentPhase !== 'chooseRoles' &&
              <StatusBar gameState={this.state} />
            }
            <div style={style.instructions}>
              {this.state.winner ? (
                this.state.winner === 'res' ? (
                  <p style={{ color: 'blue' }}>The Resistance wins!</p>
                ) : (
                  <p style={{ color: 'red' }}>The Spies win!</p>
                )
              ) : this.state.currentPhase === 'teamSelection' ? (
                <TeamSelectionInput gameState={this.state} />
              ) : this.state.currentPhase === 'voteReveal' ? (
                <VoteRevealInput gameState={this.state} />
              ) : this.state.currentPhase === 'mission' ? (
                <MissionInput gameState={this.state} />
              ) : this.state.currentPhase === 'missionReveal' ? (
                <MissionRevealInput gameState={this.state} />
              ) : (
                null
              )}
            </div>
          </div>
          {this.state.currentPhase !== 'chooseRoles' &&
            <div style={style.bottomArea}>
              <PlayerList gameState={this.state} />
              <CardArea gameState={this.state} />
            </div>
          }
        </div>
      );
    }
  }
}
