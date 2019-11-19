'use strict';

const Table = require('./table');

module.exports = class Game {
  constructor(playerCount, credits) {
    this.table = new Table(playerCount, credits);
    this.round = 0;
    this.phase = 'setup';
    this.turn = 0;
    this.winner = undefined;
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

  scorePlayersHand(player) {
    const handValues = player.hand.map(c => c.value);
    handValues.sort((a, b) => (a-b));
    const score = {
      sum: handValues.reduce((a,b) => a + b, 0),
      positiveSum: handValues.reduce((a,b) => (b > 0) ? a + b : a, 0),
      positiveCard: handValues[handValues.length - 1] > 0 ? handValues[handValues.length - 1] : 0,
      negativeCard: handValues[0] < 0 ? handValues[0] : 0,
      highestCard: 0,
      size: handValues.length,
      name: undefined,
      handRank: undefined,
      sabacc: {
        lowestX: undefined,
        lowestY: undefined,
      }
    };
    score.highestCard = score.positiveCard < Math.abs(score.negativeCard) ? score.negativeCard : score.positiveCard;

    if (score.sum !== 0) {
      score.name = `Nulhrek ${score.sum}`;
      player.score = score;
      player.score.handRank = 100 + Math.abs(score.sum);
      return score;
    }

    switch(JSON.stringify(handValues)) {
      case '[0,0]':
        score.name = 'Pure Sabacc';
        score.handRank = 0;
        break;
      case '[-10,-10,0,10,10]':
        score.name = 'Full Sabacc';
        score.handRank = 1;
        break;
      case '[-10,0,0,10]':
        score.name = 'Dual Power Coupling';
        score.handRank = 3;
        break;
      case '[-10,0,10]':
        score.name = 'Power Coupling (or Yee-Haa)';
        score.handRank = 4;
        break;
      case '[7,-8,-9,10]':
        score.name = 'Straight Staves Plus';
        score.handRank = 6;
        break;
      case '[-7,8,9,-10]':
        score.name = 'Straight Staves Minus';
        score.handRank = 7;
        break;
      case '[-1,-2,-3,-4,10]':
        score.name = 'Wizard (or Gee Whiz) Plus';
        score.handRank = 9;
        break;
      case '[1,2,3,4,-10]':
        score.name = 'Wizard (or Gee Whiz) Minus';
        score.handRank = 10;
        break;
    };
    if (score.name) {
      player.score = score;
      return score;
    };

    const sabaccValues = handValues.map(c => Math.abs(c));
    sabaccValues.sort((a, b) => (a-b));
    const sabaccPairs = sabaccValues.reduce((accumulator, currentValue) => {
      accumulator[currentValue] = accumulator[currentValue] + 1;
      return accumulator;
    },
    [0,0,0,0,0,0,0,0,0,0,0]);

    for (let c = 3; c < sabaccPairs.length; c++) {
      if (sabaccPairs[c-3] === sabaccPairs[c-2] === sabaccPairs[c-1] === sabaccPairs[c]) {
        score.sabacc.lowestX = c - 3;
        score.name = `Straight Khyron ${score.sabacc.lowestX}`;
        player.score = score;
        return score;
      }
    };

    if (sabaccPairs.indexOf(4) > 0) {
      if (sabaccPairs[0] > 0) {
        score.sabacc.lowestX = sabaccPairs.indexOf(4);
        score.name = `Fleet ${score.sabacc.lowestX}`;
        score.handRank = 2;
      } else {
        score.sabacc.lowestX = sabaccPairs.indexOf(4);
        score.name = `Squadron ${score.sabacc.lowestX}`;
        score.handRank = 8;
      }
    } else if (sabaccPairs.indexOf(3) > 0) {
      score.sabacc.lowestX = sabaccPairs.indexOf(3);
      if (sabaccPairs.indexOf(2)) {
        score.sabacc.lowestY = sabaccPairs.indexOf(2);
        score.name = `Rhylet ${score.sabacc.lowestX}, ${score.sabacc.lowestY}`;
        score.handRank = 5;
      } else {
        score.name = `Bantha's Wild ${score.sabacc.lowestX}`;
        score.handRank = 11;
      }
    } else if (sabaccPairs.indexOf(2) > 0) {
      score.sabacc.lowestX = sabaccPairs.indexOf(2);
      if (sabaccPairs.indexOf(2, score.sabacc.lowestX + 1) > 0) {
        score.sabacc.lowestY = sabaccPairs.indexOf(2, score.sabacc.lowestX + 1);
        score.name = `Dual Pair Sabacc ${score.sabacc.lowestX}, ${score.sabacc.lowestY}`;
        score.handRank = 12;
      } else {
        score.sabacc.lowestX = sabaccPairs.indexOf(2);
        score.name = `Single Pair Sabacc ${score.sabacc.lowestX}`;
        score.handRank = 13;
      }
    } else {
      score.name = `Sabacc`
    }
    player.score = score;
    return score;
  };
  scoreAllHands() {
    let winner = this.table.players[0];
    for (let p = 0; p < this.table.players.length; p++) {
      const player = this.table.players[p];
      this.scorePlayersHand(player);
      if (p > 0) {
        if (winner.score.handRank > player.score.handRank) {
          winner = player;
        } else if (winner.score.handRank === player.score.handRank) {
          if (winner.score.sum === 0) {
            if (winner.score.size < player.score.size) {
              winner = player;
            } else if (winner.score.size === player.score.size) {
              if (winner.score.positiveSum < player.score.positiveSum) {
                winner = player;
              } else if (winner.score.positiveSum === player.score.positiveSum) {
                if (winner.score.positiveCard < player.score.positiveCard) {
                  winner = player;
                } else if (winner.score.positiveCard === player.score.positiveCard) {
                  // single card blind draw
                  winner = Math.floor(Math.random()) ? winner : player;
                }
              }
            }
          } else {
            if (Math.abs(winner.score.sum) > Math.abs(player.score.sum)) {
              winner = player;
            } else if (Math.abs(winner.score.sum) === Math.abs(player.score.sum)) {
              if (winner.score.sum < player.score.sum) {
                winner = player;
              } else if (winner.score.sum === player.score.sum) {
                if (winner.score.size < player.score.size) {
                  winner = player;
                } else if (winner.score.size === player.score.size) {
                  if (winner.score.positiveSum < player.score.positiveSum) {
                    winner = player;
                  } else if (winner.score.positiveSum === player.score.positiveSum) {
                    if (winner.score.positiveCard < player.score.positiveCard) {
                      winner = player;
                    } else if (winner.score.positiveCard === player.score.positiveCard) {
                      // single card blind draw
                      winner = Math.floor(Math.random()) ? winner : player;
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    this.winner = winner;
    return this.winner;
  };
};
