import socket from '../../../index.js';

export const writeGameState = (request, payload) => {
  socket.emit('writeGameState', { request, payload });
};