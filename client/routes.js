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
    socket.on('started game', data => {
      const { game, roomData } = data;
      this.setState({
        gameStatus: game,
        roomData
      });
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
