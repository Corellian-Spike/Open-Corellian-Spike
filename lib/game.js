'use strict';

const Table = require('./table');
const Player = require('./player');
const Deck = require('./deck');
const Discard = require('./discard');
const SpikeDice = require('./dice');

module.exports = class Game {
  constructor(playerCount) {
    if (isNaN(playerCount) || playerCount < 2 || playerCount > 8) {
      throw new Error(`Invalid number of players (${playerCount}). Please select a number between 2 and 8.`)
    }
    this.table = new Table();
    this.deck = new Deck();
    this.discard = new Discard();
    this.spikeDice = new SpikeDice();
    this.players = this.initializePlayers(playerCount);
    this.state = {
      currentBet: 0,
      phase: 'setup',
      round: 0,
      turn: undefined,
    };
  };

  get playerInfoPublic() {
    return this.players.map(player => player.infoPublic);
  };

  get playerInfoPrivate() {
    return this.players.map(player => player.infoPrivate);
  };

  get activePlayers() {
    return this.players.filter(player => player.isActive);
  };

  get nextActivePlayerId() {
    if (this.activePlayers.length === 1) {
      return this.activePlayers[0].id;
    }
    const currentPlayerIndex = this.players.findIndex(player => player.id === this.state.turn);
    for (let index = currentPlayerIndex + 1; index < this.players.length; index++) {
      if (this.players[index].isActive) {
        return this.players[index].id;
      }
    };
    for (let index = 0; index < currentPlayerIndex; index ++) {
      if (this.players[index].isActive) {
        return this.players[index].id;
      }
    };
    throw new Error(`Something went wrong. There are ${this.activePlayers.length} active players.`);
  };

  get infoPublic() {
    return {
      deck: this.deck.infoPublic,
      discard: this.discard.infoPublic,
      table: this.table.infoPublic,
      players: this.playerInfoPublic,
      game: this.state
    };
  };

  payByPlayerPotAndCredits(player, pot, credits) {
    player.credits = player.credits - credits;
    pot = pot + credits;
  };

  anteByPlayer(player) {
    this.payByPlayerPotAndCredits(player, this.table.pot, 20);
    this.payByPlayerPotAndCredits(player, this.table.sabaccPot, 10);
  };

  matchCurrentBetByPlayer(player) {
    const difference = this.state.currentBet - player.currentBet;
    this.payByPlayerPotAndCredits(player, this.table.pot, difference);
    player.currentBet = this.state.currentBet;
  };

  matchAndRaiseCurrentBetByPlayerAndCredits(player, credits) {
    this.matchCurrentBetByPlayer(player);
    this.payByPlayerPotAndCredits(player, this.table.pot, credits);
    player.currentBet = player.currentBet + credits;
    this.state.currentBet = player.currentBet;
  };

  foldByPlayer(player) {
    player.isActive = false;
  };

  buyCardByPlayerDeckPotAndCredits(player, deck, pot, credits) {
    this.payByPlayerPotAndCredits(player, pot, credits);
    deck.drawTo(player);
  };

  swapCardByPlayerDeckAndHandIndex(player, deck, handIndex) {
    const card = player.hand.splice(handIndex, 1, deck.order.pop())[0];
    this.discard.order.push(card);
  }

  initializePlayers(playerCount) {
    const players = [];
    for (let playerNumber = 1; playerNumber <= playerCount; playerNumber++) {
      const player = new Player(`Player ${playerNumber}`, 250);
      player.turnAction.buyCardFromDeck = this.buyCardByPlayerDeckPotAndCredits.bind(this, player, this.deck, this.table.pot, 10);
      player.turnAction.buyCardFromDiscard = this.buyCardByPlayerDeckPotAndCredits.bind(this, player, this.discard, this.table.pot, 20);
      player.turnAction.swapCardFromDeckByHandIndex = this.swapCardByPlayerDeckAndHandIndex.bind(this, player, this.deck);
      player.turnAction.swapCardFromDiscardByHandIndex = this.swapCardByPlayerDeckAndHandIndex.bind(this, player, this.discard);
      player.wagerAction.ante = this.anteByPlayer.bind(this, player);
      player.wagerAction.matchCurrentBet = this.matchCurrentBetByPlayer.bind(this, player);
      player.wagerAction.matchAndRaiseCurrentBetByCredits = this.matchAndRaiseCurrentBetByPlayerAndCredits.bind(this, player);
      player.wagerAction.fold = this.foldByPlayer.bind(this, player);
      players.push(player);
    };
    return players;
  };

  scoreActivePlayers() {
    const playerIdsAndScores = this.activePlayers.map(player => {
      return {
        id: player.id,
        score: player.score
      };
    });
    return playerIdsAndScores.sort((a, b) => (b.score.rank - a.score.rank));
  };

  start() {
    this.state.phase = 'Shuffle';
    this.state.round = 0;
    this.state.turn = undefined;
    return;
  };

  continue() {
    if (this.state.turn === this.nextActivePlayerId) {
      this.state.phase = 'Score';
      this.state.turn = undefined;
    }

    if (this.state.phase === 'Shuffle') {
      this.state.phase = 'Deal';
      return;
    } else if (this.state.phase === 'Deal') {
      this.state.round = 1;
      this.state.phase = 'Gain';
      this.state.turn = this.players[0].id;
      return;
    } else if (this.state.phase === 'Gain') {
      const nextActivePlayerId = this.nextActivePlayerId;
      if (this.players.findIndex(player => player.id === nextActivePlayerId) < this.players.findIndex(player => player.id === this.state.turn)) {
        this.state.phase = 'Spike';
        this.state.turn = undefined;
        return
      }
      this.state.turn = nextActivePlayerId;
      return;
    } else if (this.state.phase === 'Spike') {
      this.state.phase = 'Wager';
      this.state.turn = this.activePlayers[0].id;
      return;
    } else if (this.state.phase === 'Wager') {
      const nextActivePlayerId = this.nextActivePlayerId;
      if (this.players.findIndex(player => player.id === nextActivePlayerId) < this.players.findIndex(player => player.id === this.state.turn)) {
        if (this.players.find(player => player.id === nextActivePlayerId).currentBet === this.state.currentBet) {
          if (this.state.round === 3) {
            this.state.phase = 'Score';
            this.state.turn = undefined;
            return;
          } else {
            this.state.round = this.state.round + 1;
            this.state.phase = 'Gain';
            this.state.turn = nextActivePlayerId;
            return;
          }
        } else {
          this.state.turn = nextActivePlayerId;
          return;
        }
      } else {
        this.state.turn = nextActivePlayerId;
        return;
      }
    } else if (this.state.phase === 'Score') {
      return this.end();
    }
    throw new Error(`Something went wrong. The game phase is ${this.state.phase}`);
  };

  end() {
    return;
  };
};
