import React, { Component } from 'react';
import socket from './index.js';
import Welcome from './components/welcome';
import Lobby from './components/lobby';

// function or class component? decide later...
class Routes extends Component {
  constructor() {
    super();
    this.state = {
      gameStatus: 'welcome screen',
      userId: null,
      userName: null,
      roomData: null
    };
    this.changeGameStatus = this.changeGameStatus.bind(this);
  }

  componentDidMount() {
    socket.on('joined room', data => {
      const { userId, userName, roomData } = data;
      this.setState({
        gameStatus: 'in lobby',
        userId,
        userName,
        roomData
      });
    });
  }

  changeGameStatus(data) {
    const {gameStatus, users, currentHost} = data;
    const newRoomData = {...this.roomData};
    newRoomData.users = users;
    newRoomData.currentHost = currentHost;
    this.setState({
      gameStatus,
      roomData: newRoomData
    });
  }

  render() {
    return (
      <div id="middle">
        <div id="dynamic-area">
          {this.state.gameStatus === 'welcome screen' ? (
            <Welcome />
          ) : this.state.gameStatus === 'in lobby' ? (
            <Lobby
              userId={this.state.userId}
              userName={this.state.userName}
              roomData={this.state.roomData}
              changeGameStatus={this.changeGameStatus}
            />
          ) : (
            'PLACEHOLDER FOR IN GAME'
          )}
        </div>
      </div>
    );
  }
}

export default Routes;
