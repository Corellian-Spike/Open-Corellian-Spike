'use strict';

const Deck = require('./deck');
const Discard = require('./discard');
const Player = require('./player');

module.exports = class Table {
  constructor() {
    this.pot = {
      credits: 0,
      payOutTo: (player) => {
        player.credits = player.credits + this.pot.credits;
        this.pot.credits = 0;
        return player.credits;
      },
    };
    this.sabaccPot = {
      payOutTo: (player) => {
        player.credits = player.credits + this.sabaccPot.credits;
        this.credits = 0;
        return player.credits;
      },
      credits: 0
    };
  };
  get infoPublic() {
    return {
      pot: { credits: this.pot.credits },
      sabbaccPot: { credits: this.sabaccPot.credits }
    };
  };
};
