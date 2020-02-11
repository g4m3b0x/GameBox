import React, { Component } from 'react';
import socket from '../../../index.js';
import style from './style';

export default class Instructions extends Component {
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
        {this.props.voting ? (
          <React.Fragment>
            <button
              onClick={() => this.submitVote(true)}
            >
              Approve
            </button>
            <button
              onClick={() => this.submitVote(false)}
            >
              Reject
            </button>
          </React.Fragment>
        ) : this.props.activePlayers[socket.id] ? (
          <React.Fragment>
            <p>You are party leader. Choose a team of {this.props.groupSize[Object.keys(this.props.users).length].missionSize[this.props.currentMission]}!</p>
            <button onClick={this.startVote}>Finalize Selection</button>
          </React.Fragment>
        ) : (
          <div>
            {Object.keys(this.props.groupSize).length &&
              <p>{this.props.users[Object.keys(this.props.activePlayers)[0]]} is currently proposing a team of {this.props.groupSize[Object.keys(this.props.users).length].missionSize[this.props.currentMission]}.</p>
            }
          </div>
        )}
      </div>
    );
  }
}
