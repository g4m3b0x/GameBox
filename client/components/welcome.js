import React, { Component } from 'react';
import socket from '../index.js';

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      roomName: ''
    };
    this.clickCreate = this.clickCreate.bind(this);
    this.clickJoin = this.clickJoin.bind(this);
    this.handleType = this.handleType.bind(this);
  }

  getRandomRoom() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let room = '';
    for (let i = 0; i < 4; i++) {
      room += alphabet[Math.floor(Math.random() * 26)];
    }
    return room;
  }

  clickCreate() {
    socket.emit('join room', this.getRandomRoom());
  }

  clickJoin() {
    socket.emit('join room', this.state.roomName);
  }

  handleType(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        THIS IS WELCOME.JS!
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
