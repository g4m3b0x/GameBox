import React, { Component } from 'react';
import socket from '../index.js';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      userName: 'Player',     // restore to '' later 
      roomName: 'asdf',     // restore to '' later
    };
    this.validateUserName = this.validateUserName.bind(this);
    this.validateRoomName = this.validateRoomName.bind(this);
    this.clickCreate = this.clickCreate.bind(this);
    this.clickJoin = this.clickJoin.bind(this);
    this.handleType = this.handleType.bind(this);
  }

  getRandomRoom() {
    let room = '';
    for (let i = 0; i < 4; i++) {
      room += alphabet[Math.floor(Math.random() * 26)];
    }
    return room;
  }

  validateUserName () {
    return !!this.state.userName;
  }

  validateRoomName () {
    return this.state.roomName.length === 4
      && this.state.roomName.split('').every(c => alphabet.includes(c.toUpperCase()));
  }

  clickCreate() {
    if (!this.validateUserName()) {
      console.log('INVALID USERNAME:', this.state.userName);
    } else {
      socket.emit('join room', this.getRandomRoom());
    }
  }

  clickJoin() {
    if (!this.validateUserName()) {
      console.log('INVALID USERNAME:', this.state.userName);
    } else if (!this.validateRoomName()) {
      console.log('INVALID ROOM NAME:', this.state.roomName);
    } else {
      socket.emit('join room', this.state.roomName.toUpperCase());
    }
  }

  handleType(e) {
    this.setState({ [e.target.name]: e.target.value });
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
