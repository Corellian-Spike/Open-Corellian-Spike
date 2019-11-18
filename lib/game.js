'use strict';

const Table = require('./table');

module.exports = class Game {
  constructor(playerCount, credits) {
    this.table = new Table(playerCount, credits);
    this.round = 0;
    this.phase = 'setup';
    this.turn = 0;
  };
  get infoPublic() {
    return {
      currentRound: this.round,
      currentPhase: this.phase,
      currentTurn: this.turn,
      tableStatus: this.table.infoPublic,
    }
  }

  start() {
    this.phase = 'Shuffle';
    return this.infoPublic;
  };

  loopStep() {
    switch(this.phase) {
      case 'Shuffle':
        this.phase = 'Ante';
        this.turn = 1;
        return this.infoPublic;
      case 'Ante':
        if (this.turn === this.table.players.length) {
          this.phase = 'Deal';
          this.turn = 0;
          return this.infoPublic;
        }
        this.turn = this.turn + 1;
        return this.infoPublic;
      case 'Deal':
        this.round = 1;
        this.phase = 'Gain';
        this.turn = 1;
        return this.infoPublic;
      case 'Gain':
        if (this.turn === this.table.players.length) {
          this.phase = 'Spike';
          this.turn = 0;
          return this.infoPublic;
        }
        this.turn = this.turn + 1;
        return this.infoPublic;
      case 'Spike':
        this.phase = 'Bet';
        this.turn = 1;
        return this.infoPublic;
      case 'Bet':
        if (this.turn === this.table.players.length) {
          // TODO: add conditions for betting
          if (this.round === 3) {
            this.phase = 'Score';
            this.turn = 0
            return this.infoPublic;
          }
          this.round = this.round + 1;
          this.phase = 'Gain';
          this.turn = 1;
          return this.infoPublic;
        }
        this.turn = this.turn + 1;
        return this.infoPublic;
    };
  };

  checkTurn(playerNumber) {
    if (playerNumber !== this.turn) {
      throw new Error(`it is not ${playerNumber}'s turn!`);
    }
  };

  scoreHand(hand, sum) {
    const score = {
      rank: undefined,
      name: undefined
    }
    if (sum !== 0) {
      score.rank = sum + 100;
      score.name = `Nulhrek ${sum}`
      return score;
    }
    const handValues = hand.map(c => c.value);
    handValues.sort((a, b) => (a-b));
    switch(handValues) {
      case [0,0]:

        break;
    }
  };
};
