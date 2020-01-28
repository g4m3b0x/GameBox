import React, { Component } from 'react';
import socket from './index.js';
import Welcome from './components/welcome';
import Lobby from './components/lobby';

// function or class component? decide later...
class Routes extends Component {
  constructor() {
    super();
    this.state = {gameStatus: 'welcome screen'};
  }

  componentDidMount() {
    socket.on('joined room', data => {
      const { userName, roomName } = data;
      socket.userName = userName;
      socket.roomName = roomName;
      this.setState({gameStatus: 'in lobby'});
    });
    socket.on('started game', data => {
      const { game } = data;
      this.setState({gameStatus: game});
    });
  }

  render() {
    return (
      <div id="middle">
        <div id="dynamic-area">
          {this.state.gameStatus === 'welcome screen' ? (
            <Welcome />
          ) : this.state.gameStatus === 'in lobby' ? (
            <Lobby />
          ) : (
            'PLACEHOLDER FOR IN GAME'
          )}
        </div>
      </div>
    );
  }
}

export default Routes;
