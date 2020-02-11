import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

export default class PlayerList extends Component {
  constructor() {
    super();
    // this.state = {
    //   // proposedTeam: {},
    //   // voting: false,
    //   // currentVotes: {},
    //   // activePlayers: {},
    // };
    this._isMounted = false; // prevent memory leak
    this.setProposeTeam = this.setProposeTeam.bind(this);
    this.startVote = this.startVote.bind(this);
    this.submitVote = this.submitVote.bind(this);
  }

  // componentDidMount() {
  //   this._isMounted = true;
  //   // socket.on('setVoteStatus', data => {
  //   //   if (this._isMounted) this.setState(data);
  //   // });
  //   // socket.on('proposedTeam', data => {
  //   //   if (this._isMounted) this.setState(data);
  //   // });

  //   // socket.emit('getActivePlayers');
  // }

  // componentWillUnmount() {
  //   this._isMounted = false;
  // }

  setProposeTeam(id) {
    if (
      this.props.currentPhase !== 'teamSelection'
      || !(socket.id in this.props.activePlayers)
    ) return;
    socket.emit('proposingTeam', { id });
  }
  startVote() {
    socket.emit('startVote');
  }
  submitVote(castedVote) {
    socket.emit('submitVote', castedVote);
  }
  render() {
    return this.props.players.map((user, i) => (
      <div key={i} style={style.playerListItem}>
        <p
          style={
            socket.id in this.props.res
              ? { color: 'gray' }
              : user in this.props.res
              ? { color: 'blue' }
              : { color: 'red' }
          }
          onClick={() => this.setProposeTeam(user)}
        >
          {this.props.users[user]}
        </p>
        {this.props.currentPhase === 'teamSelection' && user in this.props.proposedTeam &&
          <img
            style={{ height: '0.75em', marginLeft: '0.5em' }}
            src={this.props.proposedTeam[user]}
          />
        }
      </div>
    ));
  }
}
