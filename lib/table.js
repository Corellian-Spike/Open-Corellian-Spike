'use strict';

const Deck = require('./deck');
const Discard = require('./discard');
const Player = require('./player');

module.exports = class Table {
  constructor() {
    this.pot = {
      credits: 0,
      payOutTo: (player) => {
        return player.credits = player.credits + this.pot.credits;
      },
    };
    this.sabaccPot = {
      credits: 0,
      payOutTo: (player) => {
        return player.credits = player.credits + this.sabaccPot.credits;
      },
    };
  };
  get infoPublic() {
    return {
      pot: { credits: this.pot.credits },
      sabbaccPot: { credits: this.sabaccPot.credits }
    };
  };
};
