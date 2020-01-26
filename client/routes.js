import React, { Component } from 'react';
import socket from './index.js';
import Welcome from './components/welcome';
import Lobby from './components/lobby';

// function or class component? decide later...
class Routes extends Component {
  constructor() {
    super();
    this.state = {
      roomData: null,
    };
  }

  componentDidMount() {
    socket.on('joined', data => {
      this.setState({roomData: data});    // object from server memory
    });
  }

  render() {
    return (
      <div id="middle">
        <div id="dynamic-area">
        {
          this.state.roomData === null ? (
            <Welcome />
          ) : (
            <Lobby roomData={this.state.roomData} />
          )
        }
        </div>
      </div>
    )
  }
}

export default Routes;
