import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

export default class PlayerList extends Component {
  constructor() {
    super();
    this._isMounted = false; // prevent memory leak
    this.setProposeTeam = this.setProposeTeam.bind(this);
    this.startVote = this.startVote.bind(this);
    this.submitVote = this.submitVote.bind(this);
  }
  setProposeTeam(id) {
    if (
      this.props.currentPhase !== 'teamSelection' ||
      !(socket.id in this.props.activePlayers)
    )
      return;
    console.log('in propose team');
    socket.emit('proposingTeam', { id });
  }
  startVote() {
    socket.emit('startVote');
  }
  submitVote(castedVote) {
    socket.emit('submitVote', castedVote);
  }
  render() {
    return (
      <div style={style.playerListArea}>
        {this.props.players.map((user, i) => (
          <div key={i} style={style.playerListItem}>
            <button
              style={
                user === socket.id
                  ? socket.id in this.props.res
                    ? style.playerBlue
                    : style.playerRed
                  : socket.id === this.props.specialRoles.bodyguard && (user === this.props.specialRoles.commander || user === this.props.specialRoles.falseCommander)
                    ? style.playerPurple
                    : (socket.id in this.props.res && socket.id !== this.props.specialRoles.commander)
                      || socket.id === this.props.specialRoles.blindSpy
                        ? style.playerGray
                        : user in this.props.res
                          || (user === this.props.specialRoles.deepCover && socket.id === this.props.specialRoles.commander)
                          || (user === this.props.specialRoles.blindSpy && socket.id in this.props.spies && user !== socket.id)
                            ? style.playerBlue
                            : style.playerRed
              }
              onClick={() => this.setProposeTeam(user)}
            >
              <p style={style.playerName}>{this.props.users[user]}</p>
            </button>
            {this.props.currentPhase === 'teamSelection' && user in this.props.proposedTeam &&
              <img
                style={style.gunImage}
                src={this.props.proposedTeam[user]}
              />
            }
            {this.props.currentPhase === 'teamSelection' && this.props.voting && user in this.props.teamVotes &&
              <img
                style={{ height: '1.0em', marginLeft: '0.5em' }}
                src={
                  user !== socket.id
                    ? '/resistance_token_back.png'
                    : this.props.teamVotes[user]
                    ? '/resistance_token_approve.png'
                    : '/resistance_token_reject.png'
                }
              />
            }
          </div>
        ))}
      </div>
    );
  }
}
