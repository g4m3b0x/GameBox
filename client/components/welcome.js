import React, { Component } from 'react';
import socket from '../index.js';

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      userName: 'Player',     // restore to '' later 
      roomName: '',
    };
    this.clickCreate = this.clickCreate.bind(this);
    this.clickJoin = this.clickJoin.bind(this);
    this.handleType = this.handleType.bind(this);
  }

  componentDidMount () {

    // EVENT LISTENERS
    document.getElementById("welcome-joinRoom").addEventListener("keyup", e => {
      if (e.keyCode === 13) document.getElementById("welcome-joinButton").click();
    });

    // SOCKET LISTENERS
    socket.on('error: room not open', data => {
      const {roomName, roomExists} = data;
      console.log(roomExists    // for now, just console.log the error
        ? `Room ${roomName} has already started a game!`
        : `Room ${roomName} does not exist!`
      );
    });

  }

  clickCreate() {
    if (!this.state.userName) {
      console.log('ENTER A USERNAME');
    } else {
      socket.emit('join room', {
        userName: this.state.userName,
        roomName: undefined,
      });
    }
  }

  clickJoin() {
    if (!this.state.userName) {
      console.log('ENTER A USERNAME');
    } else if (
      this.state.roomName.length !== 4
      || !this.state.roomName
        .toUpperCase()
        .split('')
        .every(c => c >= 'A' && c <= 'Z')
    ) {
      console.log(`INVALID ROOM NAME: ${this.state.roomName}`);
    } else {
      socket.emit('join room', {
        userName: this.state.userName,
        roomName: this.state.roomName.toUpperCase(),
      });
    }
  }

  handleType(e) {
    const charLimit = {
      userName: 15,
      roomName: 4,
    };
    if (e.target.value.length <= charLimit[e.target.name]) {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  render() {
    return (
      <div id="welcome">
        <div>
          <input
            type="text"
            name="userName"
            value={this.state.userName}
            placeholder="Enter username"
            onChange={this.handleType}
          />
        </div>
        <div>
          <input
            id="welcome-joinRoom"
            type="text"
            name="roomName"
            value={this.state.roomName}
            placeholder="Enter 4-digit room code"
            onChange={this.handleType}
          />
          <button
            id="welcome-joinButton"
            onClick={this.clickJoin}
          >
            Join Room
          </button>
        </div>
        <div>
          <button onClick={this.clickCreate}>Create Room</button>
        </div>
      </div>
    );
  }
}

export default Welcome;
