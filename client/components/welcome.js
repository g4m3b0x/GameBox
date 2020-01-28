import React, { Component } from 'react';
import socket from '../index.js';

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',     // restore to '' later 
      roomName: '',
    };
    this.clickCreate = this.clickCreate.bind(this);
    this.clickJoin = this.clickJoin.bind(this);
    this.handleType = this.handleType.bind(this);
  }

  componentDidMount () {

    // EVENT LISTENERS
    document.getElementById("welcome-nameInput").addEventListener("keyup", e => {
      if (e.keyCode === 13) {
        document.getElementById(this.state.roomName ? "welcome-joinButton" : "welcome-createButton").click();
      }
    });
    document.getElementById("welcome-joinInput").addEventListener("keyup", e => {
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
        <div id="welcome-name">
          <input
            id="welcome-nameInput"
            type="text"
            name="userName"
            value={this.state.userName}
            placeholder="Enter username"
            onChange={this.handleType}
          />
        </div>
        <div id="welcome-create">
          <button
            id="welcome-createButton"
            onClick={this.clickCreate}
          >
            <img className="welcomeIcon" src="/monitor-icon.png"></img>
            Create Room
          </button>
        </div>
        <p>- or -</p>
        <div id="welcome-join">
          <input
            id="welcome-joinInput"
            type="text"
            name="roomName"
            value={this.state.roomName}
            placeholder="Enter 4-digit room code"
            onChange={this.handleType}
          />
        </div>
        <button
            id="welcome-joinButton"
            onClick={this.clickJoin}
        >
          <img className="welcomeIcon" src="/phone-icon.png"></img>
          Join Room
        </button>
      </div>
    );
  }
}

export default Welcome;
