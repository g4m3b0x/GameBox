import React, { Component } from 'react';
import socket from '../index.js';

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: this.props.roomData.roomName,
      messages: this.props.roomData.messages,
      users: [],
      currentMessage: '',
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleType = this.handleType.bind(this);
  }

  componentDidMount() {
    socket.on('receiveMessage', data => {
      this.setState({ messages: [...this.state.messages, data] });
    });
    socket.on('newUser', data => {
      this.setState({ users: data });
    });
  }

  sendMessage() {
    if (!this.state.currentMessage) return;
    socket.emit('sendMessage', {
      roomName: this.state.roomName,
      message: this.state.currentMessage,
    });
    this.setState({ currentMessage: '' });
  }

  handleType(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        YOU ARE IN THE LOBBY OF ROOM {this.state.roomName}
        <div>
          <input
            type="text"
            name="currentMessage"
            value={this.state.currentMessage}
            placeholder="message"
            onChange={this.handleType}
          />
          <button onClick={this.sendMessage}>Send</button>
        </div>
        <ul>
          {this.state.messages.map((message, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
        <ul>
          {this.state.users.map((message, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
      </div>
    );
  }
}
