import React, { Component, Fragment } from 'react';
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
      hostErrorMsg: '',
      currentMessage: ''
    };
    this._isMounted = false; // prevent memory leak
    this.handleSelect = this.handleSelect.bind(this);
    this.handleType = this.handleType.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    // GET DATA
    socket.emit('routesReducer', {
      request: 'joinedRoom'
    });
    socket.on('sendRoomData', data => {
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
    socket.on('changedSelectedGame', game => {
      if (this._isMounted)
        this.setState({ selectedGame: game, hostErrorMsg: '' });
    });
    socket.on('receiveMessage', data => {
      const { senderId, message } = data;
      if (this._isMounted)
        this.setState({
          messages: [...this.state.messages, [senderId, message]]
        });
      setTimeout(this.scrollDown, 100);
    });
    socket.on('newUser', data => {
      const { socketId, userName, currentHost } = data;
      if (this._isMounted)
        this.setState({
          users: { ...this.state.users, [socketId]: userName },
          currentHost,
          hostErrorMsg: ''
        });
    });
    socket.on('removeUser', data => {
      const { socketId, currentHost } = data;
      const newUsersObj = { ...this.state.users };
      delete newUsersObj[socketId];
      if (this._isMounted)
        this.setState({ users: newUsersObj, currentHost, hostErrorMsg: '' });
    });
    socket.on('lobbyError', msg => {
      if (this._isMounted) this.setState({ hostErrorMsg: msg });
    });

    // MISCELLANEOUS
    document.getElementById('lobby-typeMessage').focus();
    setTimeout(this.scrollDown, 100);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  scrollDown() {
    const chat = document.getElementById('lobby-chat');
    chat.scrollTop = chat.scrollHeight;
  }

  handleSelect(e) {
    socket.emit('lobbyReducer', {
      request: 'changeSelectedGame',
      payload: {
        game: e.target.value
      }
    });
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
    const noSpacesLimit = 25;
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
    socket.emit('lobbyReducer', {
      request: 'sendMessage',
      payload: { message }
    });
    this.setState({ currentMessage: '' });
  }

  render() {
    return (
      <div id="lobby">
        <div id="lobby-header">
          <div id="lobby-header-room">
            <p>ROOM CODE: {socket.roomName}</p>
            <button
              className="tiny-button"
              onClick={() => {
                socket.emit('routesReducer', { request: 'exitRoom' });
                socket.emit('disconnecting');
              }}
            >
              Exit Lobby
            </button>
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
                <Fragment>
                  <p className="error">{this.state.hostErrorMsg}</p>
                  <button
                    disabled={this.state.selectedGame === '--None--'}
                    onClick={() => {
                      socket.emit('routesReducer', {
                        request: 'startGame',
                        payload: {
                          game: this.state.selectedGame
                        }
                      });
                    }}
                  >
                    Start
                  </button>
                </Fragment>
              ) : (
                <p>(Waiting for host...)</p>
              )}
            </div>
          </div>
        </div>
        <div id="lobby-middle">
          <div id="lobby-chat">
            {this.state.messages.map(([senderId, message], i) => (
              <div key={i}>
                <p>
                  {`${this.state.users[senderId] || '(disconnected)'}`}
                  {this.state.currentHost === senderId && (
                    <img src="/crown.png" />
                  )}
                  {`: ${message}`}
                </p>
              </div>
            ))}
          </div>
          <div id="lobby-users">
            <p>Players:</p>
            {Object.keys(this.state.users).map((user, i) => (
              <div key={i}>
                <p>{`${this.state.users[user]}`}</p>
                {this.state.currentHost === user && (
                  <img src="/crown.png" />
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
