import React, { Component } from 'react';
import socket from '../index.js';

export default class Lobby extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      message: ''
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleType = this.handleType.bind(this);
  }

  componentDidMount() {
    socket.on('recieveMessage', data => {
      this.setState({ messages: [...this.state.messages, data] });
    });
  }
  sendMessage(e) {
    socket.emit('sendMessage', {
      room: this.props.roomName,
      message: this.state.message
    });
    this.setState({ message: '' });
  }
  handleType(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        <div>
          <input
            type="text"
            name="message"
            value={this.state.message}
            placeholder="message"
            onChange={this.handleType}
          />
          <button onClick={this.sendMessage}> Send</button>
        </div>
        <ol>
          {this.state.messages.map(message => (
            <li>{message}</li>
          ))}
        </ol>
      </div>
    );
  }
}
