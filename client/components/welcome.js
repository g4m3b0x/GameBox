import React, { Component } from 'react';
import socket from '../index.js';

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      roomName: '',
      userNameErrorMsg: '',
      roomNameErrorMsg: '',
    };
    this.clickCreate = this.clickCreate.bind(this);
    this.clickJoin = this.clickJoin.bind(this);
    this.handleType = this.handleType.bind(this);
    this.userNameError = this.userNameError.bind(this);
    this.roomNameError = this.roomNameError.bind(this);
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
      this.roomNameError(roomExists
        ? `Room ${roomName} has already started!`
        : `Room ${roomName} does not exist!`
      );
    });

  }

  clickCreate() {
    if (!this.state.userName) {
      this.userNameError('Enter a username!');
    } else {
      socket.emit('join room', {
        userName: this.state.userName,
        roomName: undefined,
      });
    }
  }

  clickJoin() {
    if (!this.state.userName) {
      this.userNameError('Enter a username!');
    } else if (!this.state.roomName.length) {
      this.roomNameError('Enter a room name!');
    } else if (
      this.state.roomName.length !== 4
      || !this.state.roomName
        .toUpperCase()
        .split('')
        .every(c => c >= 'A' && c <= 'Z')
    ) {
      this.roomNameError(`Invalid room name: ${this.state.roomName}`);
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

  userNameError(msg) {
    this.setState({userNameErrorMsg: msg});
    setTimeout(() => {
      if (this.state.userNameErrorMsg === msg) {
        this.setState({userNameErrorMsg: ''});
      }
    }, 5000);
  }

  roomNameError(msg) {
    this.setState({roomNameErrorMsg: msg});
    setTimeout(() => {
      if (this.state.roomNameErrorMsg === msg) {
        this.setState({roomNameErrorMsg: ''});
      }
    }, 5000);
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
          <div className="welcome-error">{this.state.userNameErrorMsg}</div>
        </div>
        <div className="welcome-text">
          <p>Host a game:</p>
        </div>
        <div id="welcome-create">
          <button
            id="welcome-createButton"
            onClick={this.clickCreate}
          >
            <img src="/monitor-icon.png"></img>
            Create Room
          </button>
        </div>
        <div className="welcome-text">
          <p>- or -</p>
        </div>
        <div id="welcome-join">
          <input
            id="welcome-joinInput"
            type="text"
            name="roomName"
            value={this.state.roomName}
            placeholder="Enter 4-digit room code"
            onChange={this.handleType}
          />
          <div className="welcome-error">{this.state.roomNameErrorMsg}</div>
        </div>
        <button
            id="welcome-joinButton"
            onClick={this.clickJoin}
        >
          <img src="/phone-icon.png"></img>
          Join Room
        </button>
      </div>
    );
  }
}

export default Welcome;
