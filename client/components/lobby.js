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
      selectedGame: '--None--',
      currentMessage: '',
    };
    this._isMounted = false;      // prevent memory leak
    this.handleSelect = this.handleSelect.bind(this);
    this.handleType = this.handleType.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    // GET DATA
    socket.emit('routes reducer', {
      request: 'joined room',
    });
    socket.on('send room data', data => {
      if (this._isMounted) this.setState(data);
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
      if (this._isMounted) this.setState({ selectedGame: game });
    });
    socket.on('receive message', data => {
      const { sender, message } = data;
      if (this._isMounted) this.setState({ messages: [...this.state.messages, [sender, message]] });
      setTimeout(this.scrollDown, 100);
    });
    socket.on('new user', data => {
      const { socketId, userName, currentHost } = data;
      if (this._isMounted) this.setState({ users: { ...this.state.users, [socketId]: userName }, currentHost });
    });
    socket.on('remove user', data => {
      const { socketId, currentHost } = data;
      const newUsersObj = { ...this.state.users };
      delete newUsersObj[socketId];
      if (this._isMounted) this.setState({ users: newUsersObj, currentHost });
    });

    setTimeout(this.scrollDown, 100);   // scrolls all the way down when you join the room
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  scrollDown() {
    const chat = document.getElementById('lobby-chat');
    chat.scrollTop = chat.scrollHeight;
  }

  handleSelect(e) {
    socket.emit('lobby reducer', {
      request: 'change selected game',
      payload: {
        game: e.target.value,
      }
    })
  }

  handleType(e) {
    const charLimit = {
      currentMessage: 1000
    };
    if (e.target.value.length <= charLimit[e.target.name]) {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  sendMessage() {
    if (!this.state.currentMessage) return;
    const noSpacesLimit = 50;
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
    socket.emit('lobby reducer', {
      request: 'send message',
      payload: { message },
    })
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
                  <option value="--None--">Select...</option>
                  <option value="Tic Tac Toe">Tic Tac Toe</option>
                  <option value="The Resistance">The Resistance</option>
                </select>
              ) : (
                <p>{this.state.selectedGame}</p>
              )}
            </div>
            <div id="lobby-header-game-start-game">
              {this.state.currentHost === socket.id ? (
                <button
                  type="button"
                  onClick={() => {
                    if (this.state.selectedGame !== '--None--') {
                      socket.emit('routes reducer', {
                        request: 'start game',
                        payload: {
                          game: this.state.selectedGame,
                        }
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
            <p>Players:</p>
            {Object.keys(this.state.users).map((user, i) => (
              <div key={i}>
                <p>{`${this.state.users[user]}`}</p>
                {this.state.currentHost === user && (
                  <img src="/crown.png"></img>
                )}
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
