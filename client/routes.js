import React, { Component } from 'react';
import socket from './index.js';
import Welcome from './components/welcome';
import Lobby from './components/lobby';

// function or class component? decide later...
class Routes extends Component {
  constructor() {
    super();
    this.state = {
      room: null,
    };
  }
  componentDidMount() {
    socket.on('joined', data => {
      this.setState({ room: data });
    });
  }
  render() {
    if (this.state.room === null) {
      return <Welcome />;
    } else {
      return <Lobby roomName={this.state.room} />;
    }
  }
}

export default Routes;
