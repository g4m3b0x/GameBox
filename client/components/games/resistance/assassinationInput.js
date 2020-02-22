import React from 'react';
import socket from '../../../index.js';

const AssassinationInput = props => {
  const { gameState } = props;
  return gameState.specialRoles.assassin === socket.id ? (
    <p>Assassinate the Commander!</p>
  ) : (
    <p>Waiting for Assassin to guess the Commander...</p>
  );
};

export default AssassinationInput;