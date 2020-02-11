import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

export default class Voting extends Component {
  constructor() {
    super();
    this.state = {
      proposedTeam: {},
      voting: false,
      currentVotes: {},
      activePlayers: {},
    };
    this._isMounted = false; // prevent memory leak
    this.setProposeTeam = this.setProposeTeam.bind(this);
    this.startVote = this.startVote.bind(this);
    this.submitVote = this.submitVote.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    socket.on('setVoteStatus', data => {
      if (this._isMounted) this.setState(data);
    });
    socket.on('proposedTeam', data => {
      if (this._isMounted) this.setState(data);
    });

    socket.emit('getActivePlayers');
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setProposeTeam(id) {
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
      <div>
        <div>
          {Object.keys(this.state.proposedTeam).map((user, i) => (
            <p key={i}>{this.props.users[user]}</p>
          ))}
          {this.state.voting ? (
            <React.Fragment>
              <button
                disabled={!this.state.voting}
                onClick={() => this.submitVote(true)}
              >
                Approve
              </button>
              <button
                disabled={!this.state.voting}
                onClick={() => this.submitVote(false)}
              >
                Reject
              </button>
            </React.Fragment>
          ) : this.state.activePlayers[socket.id] ? (
            <div>
              <p>You are party leader</p>
              <ol>
                {this.props.players.map((user, i) => (
                  <button key={i} onClick={() => this.setProposeTeam(user)}>
                    {this.props.users[user]}
                  </button>
                ))}
              </ol>
              <button onClick={this.startVote}>Finalize Selection</button>
            </div>
          ) : (
            <div>
              <p>{this.props.users[Object.keys(this.state.activePlayers)[0]]} is currently proposing teams.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
