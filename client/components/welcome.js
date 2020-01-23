import React, {Component} from 'react';
import socket from '../index.js';

class Welcome extends Component {
  constructor () {
    super();
    this.state = {
      name: '',
    };
    this.handleClick = this.handleClick.bind(this);
    this.joinClick = this.joinClick.bind(this);
  }

  componentDidMount () {
    socket.on('joined', data => console.log(data));
  }

  getRandomRoom () {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let room = '';
    for (let i = 0; i < 4; i++) {
      room += alphabet[Math.floor(Math.random() * 26)];
    }
    return room;
  };

  handleClick () {
    socket.emit('join room', this.getRandomRoom());
  }

  joinClick () {
    socket.emit('join room', this.state.name);
  }

  render () {
    return (
      <div>
        THIS IS WELCOME.JS!
        <input
          type="text"
          name="room-name"
          value={this.state.name}
          onChange={e => this.setState({name: e.target.value})}
        />
        <button onClick={this.joinClick}> Join Room</button>
        <button onClick={this.handleClick}>Create Room</button>
      </div>
    );
  }
}

export default Welcome;