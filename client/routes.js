import React, { Component } from 'react';
import socket from './index.js';
import Welcome from './components/welcome';
import Lobby from './components/lobby';
import Games from './components/games/';

// function or class component? decide later...
class Routes extends Component {
  constructor() {
    super();
    this.state = { status: 'welcome screen' };
  }

  componentDidMount() {
    socket.on('joinedRoom', data => {
      const { userName, roomName, hostBool } = data;
      socket.userName = userName;
      socket.roomName = roomName;
      socket.hostBool = hostBool;
      this.setState({ status: 'lobby' });
    });
    socket.on('you are now host', () => {
      socket.hostBool = true;
    });
    socket.on('startedGame', data => {
      const { game } = data;
      this.setState({ status: game });
    });
    socket.on('status', data => this.setState({ status: data }));
  }

  render() {
    return (
      <div id="middle">
        <div id="dynamic-area">
          {this.state.status === 'welcome screen' ? (
            <Welcome />
          ) : this.state.status === 'lobby' ? (
            <Lobby />
          ) : (
            Games[this.state.status]
          )}
        </div>
      </div>
    );
  }
}

export default Routes;
