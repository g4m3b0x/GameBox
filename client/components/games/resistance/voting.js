import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

export default class Voting extends Component {
  constructor(props) {
    super();
    this.state = {
      proposedTeam: {},
      voting: false,
      currentVotes: {},
      activePlayers: {},
    };
    this.setProposeTeam = this.setProposeTeam.bind(this);
    this.startVote = this.startVote.bind(this);
    this.submitVote = this.submitVote.bind(this);
  }

  componentDidMount() {
    socket.on('setVoteStatus', data => {
      this.setState(data);
    });
    socket.on('proposedTeam', data => {
      this.setState({ proposedTeam: data });
    });

    socket.emit('getActivePlayers');
  }

  setProposeTeam(id) {
    socket.emit('proposingTeam', {
      id
    });
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
          {Object.keys(this.state.proposedTeam).map(user => (
            <p>{this.props.users[user]}</p>
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
              <p>You are partyLeader</p>
              <ol>
                {Object.keys(this.props.users).map(user => (
                  <button onClick={() => this.setProposeTeam(user)}>
                    {this.props.users[user]}
                  </button>
                ))}
              </ol>
              <button onClick={this.startVote}>Finalize Selection</button>
            </div>
          ) : (
            <div>
              <p>Party leader is currently proposing teams.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
