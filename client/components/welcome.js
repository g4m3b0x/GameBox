import React, { Component } from 'react';
import socket from '../index.js';

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      userName: 'Player',     // restore to '' later 
      roomName: '',
    };
    this.validateUserName = this.validateUserName.bind(this);
    this.validateRoomName = this.validateRoomName.bind(this);
    this.clickCreate = this.clickCreate.bind(this);
    this.clickJoin = this.clickJoin.bind(this);
    this.handleType = this.handleType.bind(this);
  }

  validateUserName () {
    return !!this.state.userName;
  }

  validateRoomName () {
    return this.state.roomName.length === 4
      && this.state.roomName
        .toUpperCase()
        .split('')
        .every(c => c >= 'A' && c <= 'Z');
  }

  clickCreate() {
    if (!this.validateUserName()) {
      console.log('INVALID USERNAME:', this.state.userName);
    } else {
      socket.emit('join room', {
        userName: this.state.userName,
        roomName: undefined,
      });
    }
  }

  clickJoin() {
    if (!this.validateUserName()) {
      console.log('INVALID USERNAME:', this.state.userName);
    } else if (!this.validateRoomName()) {
      console.log('INVALID ROOM NAME:', this.state.roomName);
    } else {
      socket.emit('join room', {
        userName: this.state.userName,
        roomName: this.state.roomName.toUpperCase(),
      });
    }
  }

  handleType(e) {
    const charLimit = {
      userName: 20,
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
            type="text"
            name="roomName"
            value={this.state.roomName}
            placeholder="Enter 4-digit room code"
            onChange={this.handleType}
          />
          <button onClick={this.clickJoin}> Join Room</button>
        </div>
        <div>
          <button onClick={this.clickCreate}>Create Room</button>
        </div>
      </div>
    );
  }
}

export default Welcome;
