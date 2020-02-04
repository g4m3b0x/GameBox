const teamSize = {
  5: {res: 3, spies: 2},
  6: {res: 4, spies: 2},
  7: {res: 4, spies: 3},
  8: {res: 5, spies: 3},
  9: {res: 6, spies: 3},
  10: {res: 6, spies: 4},
};

module.exports = class Resistance {
  constructor(users, dedicatedScreen) {
    this.users = users;
    this.res = [];
    this.spies = [];
  }

};