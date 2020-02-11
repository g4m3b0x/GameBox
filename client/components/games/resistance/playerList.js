import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

export default class PlayerList extends Component {
  constructor() {
    super();
    this.state = {
      proposedTeam: {},
      // voting: false,
      // currentVotes: {},
      // activePlayers: {},
    };
    this._isMounted = false; // prevent memory leak
    this.setProposeTeam = this.setProposeTeam.bind(this);
    this.startVote = this.startVote.bind(this);
    this.submitVote = this.submitVote.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    // socket.on('setVoteStatus', data => {
    //   if (this._isMounted) this.setState(data);
    // });
    socket.on('proposedTeam', data => {
      if (this._isMounted) this.setState(data);
    });

    // socket.emit('getActivePlayers');
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

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
    console.log(this.state.proposedTeam)
    return (
      <div>
        {this.props.players.map((user, i) => (
          <p
            key={i}
            // style={
            //   this.props.currentPhase === 'teamSelection' && user in this.state.proposedTeam
            //     ? style.bold
            //     : null
            // }
            style={
              socket.id in this.props.res
                ? style.gray
                : user in this.props.res
                ? style.blue
                : style.red
            }
            onClick={() => this.setProposeTeam(user)}
          >
            {this.props.users[user]}
          </p>
        ))}
      </div>
    );
  }
}
