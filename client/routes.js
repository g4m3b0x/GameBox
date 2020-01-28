import React, { Component } from 'react';
import socket from './index.js';
import Welcome from './components/welcome';
import Lobby from './components/lobby';
import TicTac from './components/tic-tac-toe';
// function or class component? decide later...
class Routes extends Component {
  constructor() {
    super();
    this.state = { gameStatus: 'welcome screen' };
  }

  componentDidMount() {
    socket.on('joined room', data => {
      const { userName, roomName, hostBool } = data;
      socket.userName = userName;
      socket.roomName = roomName;
      socket.hostBool = hostBool;
      this.setState({ gameStatus: 'in lobby' });
    });
    socket.on('started game', data => {
      const { game } = data;
      this.setState({ gameStatus: game });
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
            <TicTac />
          )}
        </div>
      </div>
    );
  }
}

export default Routes;
