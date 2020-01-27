import React, { Component } from 'react';
import socket from '../index.js';

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.userName,
      roomName: this.props.roomData.roomName,
      messages: this.props.roomData.messages,
      users: [],
      currentMessage: '',
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleType = this.handleType.bind(this);
  }

  componentDidMount() {

    // EVENT LISTENERS
    document.getElementById("lobby-typeMessage").addEventListener("keyup", e => {
      if (e.keyCode === 13) document.getElementById("lobby-sendMessage").click();
    });
  
    // SOCKET LISTENERS
    socket.on('receiveMessage', data => {
      const {sender, message} = data;
      this.setState({ messages: [...this.state.messages, [sender, message]] });
      this.scrollDown();
    });
    socket.on('newUser', data => {
      this.setState({ users: data });
    });

    this.scrollDown();    // scrolls all the way down when you join the room
  }

  scrollDown () {
    const chat = document.getElementById("lobby-chat");
    chat.scrollTop = chat.scrollHeight;
  }

  sendMessage() {
    if (!this.state.currentMessage) return;
    socket.emit('sendMessage', {
      roomName: this.state.roomName,
      sender: this.state.userName,
      message: this.state.currentMessage,
    });
    this.setState({ currentMessage: '' });
  }

  handleType(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div id="lobby">
        <div id="lobby-header">
          YOU ARE IN THE LOBBY OF ROOM {this.state.roomName}
        </div>
        <div id="lobby-middle">
          <div id="lobby-chat">
          {
            this.state.messages.map(([sender, message], i) => (
              <div key={i}>{`${sender}: ${message}`}</div>
            ))
          }
          </div>
          <div id="lobby-users">
          {
            this.state.users.map((user, i) => (
              <div key={i}>{`${user}`}</div>
            ))
          }
          </div>
        </div>
        <div id="lobby-bottom">
          <input
            id="lobby-typeMessage"
            type="text"
            name="currentMessage"
            value={this.state.currentMessage}
            placeholder="Type a message..."
            onChange={this.handleType}
          />
          <button
            id="lobby-sendMessage"
            onClick={this.sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    );
  }
}
