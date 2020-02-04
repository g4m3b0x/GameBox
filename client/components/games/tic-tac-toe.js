import React, { Component } from 'react';
import socket from '../../index.js';

export default class TicTac extends Component {
  constructor() {
    super();
    this.state = {
      gameBoard: [[]],
      winner: null
    };
    this._isMounted = false;      // prevent memory leak
    this.move = this.move.bind(this);
    this.returnToLobby = this.returnToLobby.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (socket.hostBool) {    // this should only be done once, so we make the host do it
      socket.emit('game data reducer', {
        request: 'get initial game state'
      });
    }
    socket.on('send game state', data => {
      if (this._isMounted) this.setState(data);
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  move(x, y) {
    socket.emit('game data reducer', {
      request: 'send move',
      payload: {x, y},
    })
  }

  returnToLobby() {
    socket.emit('routes reducer', {
      request: 'return to lobby'
    });
  }

  render() {
    return (
      <div>
        {!this.state.winner ? (
          <div style={styleTable}>
            {this.state.gameBoard.map((row, y) => 
              <div style={styleRow}>
                {this.state.gameBoard[y].map((col, x) => 
                  <div style={styleCell}>
                    <div
                      style={styleCellDiv}
                      onClick={() => {
                        this.move(x, y);
                      }}
                    >
                      {this.state.gameBoard[y][x]}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p>{this.state.winner === -1 ? 'Draw!' : `${this.state.winner} wins!`}</p>
            <button onClick={this.returnToLobby}> Back to Lobby</button>
          </div>
        )}
      </div>
    );
  }
}

// IN-LINE STYLES:

const styleTable = {
  height: '45vh',
  width: '45vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const styleRow = {
  height: '30%',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
};

const styleCell = {
  height: '100%',
  width: '30%',
};

const styleCellDiv = {
  height: '100%',
  width: '100%',
  fontSize: '3em',
  borderRadius: '0.5em',
  border: '2px solid blue',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}