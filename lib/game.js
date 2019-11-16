'use strict';

const Table = require('./table');

module.exports = class Game {
  constructor(playerCount, credits) {
    this.table = new Table(playerCount, credits);
    this.hand = 0;
    this.round = undefined;
    this.phase = 'setup';
    this.turn = undefined;
  };
  get infoPublic() {
    return {
      currentHand: this.hand,
      currentRound: this.round,
      currentPhase: this.phase,
      currentTurn: this.turn,
      tableStatus: this.table.infoPublic,
    }
  }

  start() {
    this.table.deck.shuffle();
    this.hand = 1;
    this.phase = 'ante';
    this.table.ante();
    this.phase = 'dealing';
    this.table.deal();
    this.round = 1;
    this.phase = 'draw';
    this.turn = 1;
    return this.infoPublic;
  };

  takeTurn() {
    const player = this.table.players[this.turn];

  }
};
