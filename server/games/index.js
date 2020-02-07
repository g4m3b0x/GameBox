const TicTacToe = require('./tic-tac-toe');
const Resistance = require('./resistance');

module.exports = {
  'Tic Tac Toe': {
    min: 2,
    max: Infinity,
    instance: TicTacToe,
  },
  'The Resistance': {
    min: 1,   // RESTORE THIS TO 5 LATER
    max: 10,
    instance: Resistance,
  }
};