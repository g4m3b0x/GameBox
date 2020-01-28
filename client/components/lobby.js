import React, { Component } from 'react';
import socket from '../index.js';

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      users: {},
      currentHost: '',
      currentMessage: '',
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleType = this.handleType.bind(this);
  }

  componentDidMount() {

    // GET DATA
    socket.emit('request data', {
      request: 'joined room',
    });
    socket.on('receive data', data => {
      this.setState(data);
    });

    // EVENT LISTENERS
    document
      .getElementById('lobby-typeMessage')
      .addEventListener('keyup', e => {
        if (e.keyCode === 13)
          document.getElementById('lobby-sendMessage').click();
      });

    // SOCKET LISTENERS
    socket.on('receive message', data => {
      const { sender, message } = data;
      this.setState({ messages: [...this.state.messages, [sender, message]] });
      setTimeout(this.scrollDown, 100);
    });
    socket.on('new user', data => {
      const [socketId, userName] = data;
      this.setState({ users: { ...this.state.users, [socketId]: userName } });
    });
    socket.on('remove user', data => {
      const { socketId, currentHost } = data;
      const newUsersObj = { ...this.state.users };
      delete newUsersObj[socketId];
      this.setState({ users: newUsersObj, currentHost });
    });

    setTimeout(this.scrollDown, 100);   // scrolls all the way down when you join the room
  }

  scrollDown() {
    const chat = document.getElementById('lobby-chat');
    chat.scrollTop = chat.scrollHeight;
  }

  sendMessage() {
    if (!this.state.currentMessage) return;
    socket.emit('send message', {
      message: this.state.currentMessage
    });
    this.setState({ currentMessage: '' });
  }

  handleType(e) {
    const charLimit = {
      currentMessage: 100
    };
    if (e.target.value.length <= charLimit[e.target.name]) {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  render() {
    return (
      <div id="lobby">
        <div id="lobby-header">
          <div id="lobby-header-room">ROOM CODE: {socket.roomName}</div>
          <div id="lobby-header-game">
            GAME:
            {'<PLACEHOLDER>'}
            {this.state.currentHost === socket.id ? (
              <button
                type="button"
                onClick={() => {
                  socket.emit('start game', {
                    game: 'game',
                    roomName: socket.roomName,
                  });
                }}
              >
                Start game
              </button>
            ) : (
              '(Waiting for host to start game...)'
            )}
          </div>
        </div>
        <div id="lobby-middle">
          <div id="lobby-chat">
            {this.state.messages.map(([sender, message], i) => (
              <div key={i}>{`${sender}: ${message}`}</div>
            ))}
          </div>
          <div id="lobby-users">
            {Object.keys(this.state.users).map((user, i) => (
              <div key={i}>
                {`${this.state.users[user]}` +
                  (this.state.currentHost === user ? ' (host)' : '')}
              </div>
            ))}
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
          <button id="lobby-sendMessage" onClick={this.sendMessage}>
            Send
          </button>
        </div>
      </div>
    );
  }
}
