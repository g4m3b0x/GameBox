import React, { Component } from 'react';
import socket from './index.js';
import Welcome from './components/welcome';
import Lobby from './components/lobby';

// function or class component? decide later...
class Routes extends Component {
  constructor() {
    super();
    this.state = {
      userName: null,
      roomData: null,
    };
  }

  componentDidMount() {
    socket.on('joined room', data => {
      const {userName, roomData} = data;
      this.setState({
        userName,
        roomData,       // object from server memory
      });
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
            <Lobby
              userName={this.state.userName}
              roomData={this.state.roomData}
            />
          )
        }
        </div>
      </div>
    )
  }
}

export default Routes;
