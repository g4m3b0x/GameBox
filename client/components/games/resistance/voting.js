import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

export default class Voting extends Component {
  constructor(props) {
    super();
    this.state = {
      proposedTeam: {},
      voting: false,
      currentVotes: {}
    };
    this.setProposeTeam = this.setProposeTeam.bind(this);
    this.startVote = this.startVote.bind(this);
    this.submitVote = this.submitVote.bind(this);
  }

  componentDidMount() {
    socket.on('voting', data => {
      console.log('invoting');
      this.setState({ voting: true });
    });
    socket.on('proposedTeam', data => {
      this.setState({ proposedTeam: data });
    });
  }

  setProposeTeam(id) {
    socket.emit('proposingTeam', {
      id
    });
  }
  startVote() {
    socket.emit('startVote', 'startVote');
  }
  submitVote(castedVote) {
    socket.emit('submitVote', false);
  }
  render() {
    return (
      <div>
        <div>
          {Object.keys(this.state.proposedTeam).map(user => (
            <p>{this.props.users[user]}</p>
          ))}
          <button
            disabled={!this.state.voting}
            onClick={() => this.submitVote(true)}
          >
            {' '}
            vote true
          </button>
          {this.props.activePlayers[socket.id] ? (
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
              <p>Party leader is selecting</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
