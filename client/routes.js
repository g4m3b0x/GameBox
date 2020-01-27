import React, { Component } from 'react';
import socket from './index.js';
import Welcome from './components/welcome';
import Lobby from './components/lobby';

// function or class component? decide later...
class Routes extends Component {
  constructor() {
    super();
    this.state = {
      userId: null,
      userName: null,
      roomData: null
    };
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    socket.on('joined room', data => {
      const { userId, userName, roomData } = data;
      this.setState({
        userId,
        userName,
        roomData
      });
    });
  }

  startGame(data) {
    const {users, currentHost} = data;
    const newRoomData = {...this.roomData};
    newRoomData.users = users;
    newRoomData.currentHost = currentHost;
    this.setState({roomData: newRoomData});
  }

  render() {
    console.log('THIS.STATE:', this.state);
    return (
      <div id="middle">
        <div id="dynamic-area">
          {this.state.roomData === null ? (
            <Welcome />
          ) : (
            <Lobby
              userId={this.state.userId}
              userName={this.state.userName}
              roomData={this.state.roomData}
              startGame={this.startGame}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Routes;
