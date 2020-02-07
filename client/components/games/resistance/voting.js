import React, { Component } from 'react';
import socket from '../../../index.js';

export default class Voting extends Component {
  constructor(props) {
    super();
    this.state = {
      proposedTeam: {}
    };
    this.setProposeTeam = this.setProposeTeam.bind(this);
  }

  componentDidMount() {
    socket.on('voting', data => {
      this.setState(data);
    });
    socket.on('proposedTeam', data => {
      this.setState({ proposedTeam: data });
    });
  }

  setProposeTeam(id) {
    socket.emit('proposingTeam', {
      id
    });
    // let newState = this.state.proposedTeam;
    // newState[id] = this.props.users[id];
    // this.setState({ proposedTeam: newState });
  }

  render() {
    return (
      <div>
        <div>
          {Object.keys(this.state.proposedTeam).map(user => (
            <p>{this.props.users[user]}</p>
          ))}

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
