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
    console.log(player.credits)
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
    const activePlayers = this.players.filter(player => player.isActive);
    const playerIdsAndScores = activePlayers.map(player => {
      return {
        id: player.id,
        score: player.score
      };
    });
    return playerIdsAndScores.sort((a, b) => (b.score.rank - a.score.rank));
  };

  start() {
    return;
  };
  continue() {
    return;
  };
  end() {
    return;
  };
};
