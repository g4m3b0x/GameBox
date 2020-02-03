import React, { Component } from 'react';
import socket from '../index.js';

export default class Lobby extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      users: {},
      currentHost: null,
      dedicatedScreen: null,
      currentGame: '--None--',
      currentMessage: '',
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleType = this.handleType.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {

    // GET DATA
    socket.emit('request data from server', {
      request: 'joined room',
    });
    socket.on('send room data', data => {
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
    socket.on('changed selected game', game => {
      this.setState({ currentGame: game });
    });
    socket.on('receive message', data => {
      const { sender, message } = data;
      this.setState({ messages: [...this.state.messages, [sender, message]] });
      setTimeout(this.scrollDown, 100);
    });
    socket.on('new user', data => {
      const { socketId, userName, currentHost } = data;
      this.setState({ users: { ...this.state.users, [socketId]: userName }, currentHost });
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

  handleSelect(e) {
    socket.emit('change selected game', {
      game: e.target.value,
    });
  }

  handleType(e) {
    const charLimit = {
      currentMessage: 100
    };
    if (e.target.value.length <= charLimit[e.target.name]) {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  sendMessage() {
    if (!this.state.currentMessage) return;
    const noSpacesLimit = 20;
    const message = this.state.currentMessage
      .split(' ')
      .map(word => {
        if (word.length <= noSpacesLimit) return word;
        const numBreaks = Math.floor(word.length / noSpacesLimit);
        const newWordArr = [];
        for (let i = 0; i < numBreaks; i++) {
          newWordArr.push(
            word.slice(i * noSpacesLimit, (i + 1) * noSpacesLimit)
          );
        }
        return newWordArr.join(' ');
      })
      .join(' ');
    socket.emit('send message', { message });
    this.setState({ currentMessage: '' });
  }

  render() {
    return (
      <div id="lobby">
        <div id="lobby-header">
          <div id="lobby-header-room">
            <p>ROOM CODE: {socket.roomName}</p>
          </div>
          <div id="lobby-header-game">
            <div id="lobby-header-game-text">
              <p>GAME:</p>
            </div>
            <div id="lobby-header-game-selection">
              {this.state.currentHost === socket.id ? (
                <select onChange={this.handleSelect}>
                  <option value="No game selected">Select...</option>
                  <option value="Tic Tac Toe">Tic Tac Toe</option>
                </select>
              ) : (
                <p>{this.state.currentGame}</p>
              )}
            </div>
            <div id="lobbyheader-game-start-game">
              {this.state.currentHost === socket.id ? (
                <button
                  type="button"
                  onClick={() => {
                    if (this.state.currentGame !== '--None--') {
                      socket.emit('start game', {
                        game: this.state.currentGame,
                      });
                    }
                  }}
                >
                  Start game
                </button>
              ) : (
                <p>(Waiting for host...)</p>
              )}
            </div>
          </div>
        </div>
        <div id="lobby-middle">
          <div id="lobby-chat">
            {this.state.messages.map(([sender, message], i) => (
              <div key={i}><div className="chat-msg">{`${sender}: ${message}`}</div></div>
            ))}
          </div>
          <div id="lobby-users">
            <div>Players:</div>
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
