import React, { Component } from 'react';
import socket from '../index.js';

class Welcome extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      roomName: '',
      dedicatedScreen: false,
      userNameErr: false,
      roomNameErr: ''
    };
    this.clickCreate = this.clickCreate.bind(this);
    this.clickJoin = this.clickJoin.bind(this);
    this.handleType = this.handleType.bind(this);
    this.toggleDedicatedScreen = this.toggleDedicatedScreen.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    // EVENT LISTENERS
    document
      .getElementById('welcome-nameInput')
      .addEventListener('keyup', e => {
        if (e.keyCode === 13) {
          document
            .getElementById(
              this.state.roomName
                ? 'welcome-joinButton'
                : 'welcome-createButton'
            )
            .click();
        }
      }
    );
    document
      .getElementById('welcome-joinInput')
      .addEventListener('keyup', e => {
        if (e.keyCode === 13)
          document.getElementById('welcome-joinButton').click();
      }
    );
    // SOCKET LISTENERS
    socket.on('errorOnJoin', data => {
      const { msg } = data;
      this.handleError(msg);
    });
  }

  clickCreate() {
    if (!this.state.userName) {
      this.handleError('user');
    } else {
      socket.emit('routesReducer', {
        request: 'createRoom',
        payload: {
          userName: this.state.userName,
          dedicatedScreen: this.state.dedicatedScreen ? socket.id : null
        }
      });
    }
  }

  clickJoin() {
    if (!this.state.userName) {
      this.handleError('user');
    } else if (!this.state.roomName.length) {
      this.handleError('Enter a room name!');
    } else if (
      this.state.roomName.length !== 4 ||
      !this.state.roomName
        .toUpperCase()
        .split('')
        .every(c => c >= 'A' && c <= 'Z')
    ) {
      this.handleError(`Invalid room name: ${this.state.roomName}`);
    } else {
      socket.emit('routesReducer', {
        request: 'joinRoom',
        payload: {
          userName: this.state.userName,
          roomName: this.state.roomName.toUpperCase(),
          dedicatedScreen: null
        }
      });
    }
  }

  handleType(e) {
    const charLimit = {
      userName: 15,
      roomName: 4
    };
    if (e.target.value.length <= charLimit[e.target.name]) {
      const newState = { [e.target.name]: e.target.value };
      if (e.target.name === 'userName') newState.userNameErr = false;
      else newState.roomNameErr = '';
      this.setState(newState);
    }
  }
  handleError(error) {
    if (error === 'user') this.setState({ userNameErr: true });
    else this.setState({ roomNameErr: error });
  }

  toggleDedicatedScreen(e) {
    if (this.state.dedicatedScreen) {
      document.getElementById('welcome-nameInput').removeAttribute('disabled');
    } else {
      document
        .getElementById('welcome-nameInput')
        .setAttribute('disabled', 'true');
    }
    this.setState({
      userName: this.state.dedicatedScreen ? '' : '(Screen)',
      dedicatedScreen: !this.state.dedicatedScreen
    });
  }

  render() {
    return (
      <div id="welcome">
        <div id="welcome-name">
          <input
            id="welcome-nameInput"
            type="text"
            name="userName"
            value={this.state.userName}
            placeholder="Enter username"
            onChange={this.handleType}
          />
          <div className="error">
            <p>{this.state.userNameErr && 'Enter a Username!'}</p>
          </div>
        </div>
        <div className="welcome-text">
          <p>Host a game:</p>
        </div>
        <div id="welcome-create">
          <button id="welcome-createButton" onClick={this.clickCreate}>
            <img src="/monitor-icon.png"></img>
            Create Room
          </button>
          <div id="welcome-dedicatedScreen">
            <input type="checkbox" onClick={this.toggleDedicatedScreen} />
            <p>This device is a dedicated screen</p>
          </div>
        </div>
        <div className="welcome-text">
          <p>- or -</p>
        </div>
        <div id="welcome-join">
          <input
            id="welcome-joinInput"
            type="text"
            name="roomName"
            value={this.state.roomName}
            placeholder="Enter 4-letter room code"
            onChange={this.handleType}
            disabled={this.state. dedicatedScreen}
          />
          <div className="error">
            <p>{this.state.roomNameErr && `${this.state.roomNameErr}`}</p>
          </div>
        </div>
        <button
          id="welcome-joinButton"
          onClick={this.clickJoin}
          disabled={this.state.dedicatedScreen}
        >
          <img src="/phone-icon.png"></img>
          Join Room
        </button>
      </div>
    );
  }
}

export default Welcome;
