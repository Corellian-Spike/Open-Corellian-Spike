'use strict';

const Deck = require('./deck');
const Discard = require('./discard');
const Player = require('./player');

module.exports = class Table {
  constructor(playerCount, credits) {
    this.pot = 0;
    this.sabaccPot = 0;
    this.deck = new Deck();
    this.discard = new Discard();
    this.players = this.initializePlayers(playerCount, credits);
  };
  get infoPublic() {
    const playerStati = []
    for (let p = 0; p < this.players.length; p++) {
      playerStati.push(this.players[p].infoPublic)
    }
    return {
      pot: this.pot,
      sabaccPot: this.sabaccPot,
      deckRemaining: this.deck.order.length,
      topDiscard: this.discard.top,
      discardRemaining: this.discard.order.length,
      players: this.players.length,
      playerStati: playerStati,
    };
  };

  anteByPlayerId(playerId) {
    const player = this.players.find(p => p.id === playerId);
    player.payPot(2);
    player.paySabaccPot(1);
  };

  deal() {
    for (let c = 0; c < 2; c++) {
      for (let p = 0; p < this.players.length; p++) {
        this.players[p].hand.push(this.deck.draw());
      };
    };
    this.discard.discard(this.deck.draw());
  };
  rollSpikeDice() {
    const rollOne = Math.floor((Math.random() * 6) + 1);
    const rollTwo = Math.floor((Math.random() * 6) + 1);
    return {
      spikeDiceMatch: rollOne === rollTwo,
      rollOne: rollOne,
      rollTwo: rollTwo
    };
  };
  payPotByPlayerId(playerId, amount) {
    const player = this.players.find(p => p.id === playerId);
    player.credits = player.credits - amount;
    this.pot = this.pot + amount;
  };
  paySabaccPotByPlayerId(playerId, amount) {
    const player = this.players.find(p => p.id === playerId);
    player.credits = player.credits - amount;
    this.sabaccPot = this.sabaccPot + amount;
  };
  buyFromDeckByPlayerId(playerId) {
    const player = this.players.find(p => p.id === playerId);
    // if (player.credits < 1) {
    //   throw new Error(`Insufficient Credits\n`);
    // } else {
      player.hand.push(this.deck.draw());
      player.credits = player.credits-1;
      this.pot = this.pot+1;
    // };
    return player.info;
  };
  buyFromDiscardByPlayerId(playerId) {
    const player = this.players.find(p => p.id === playerId);
    player.hand.push(this.discard.draw());
    this.discard.discard(this.deck.draw());
    player.credits = player.credits-2;
    this.pot = this.pot-1
    return player.info;
  };
  swapFromDeckByPlayerIdAndCardIndex(playerId, cardIndex) {
    const player = this.players.find(p => p.id === playerId);
    if (!player.hand[cardIndex]) {
      throw new Error (`Invalid Card Index\n`)
    }
    const newCard = this.deck.draw();
    this.discard.discard(player.hand[cardIndex]);
    player.hand[cardIndex] = newCard;
    return player.info;
  };
  swapFromDiscardByPlayerIdAndCardIndex(playerId, cardIndex) {
    const player = this.players.find(p => p.id === playerId);
    if (!player.hand[cardIndex]) {
      throw new Error (`Invalid Card Index\n`)
    }
    const newCard = this.discard.draw();
    this.discard.discard(player.hand[cardIndex]);
    player.hand[cardIndex] = newCard;
    return player.info;
  };

  spikeHandSwap() {
    for (let p = 0; p < this.players.length; p++) {
      for (let c = 0; c < this.players[p].hand.length; c++) {
        this.swapFromDeckByPlayerIdAndCardIndex(this.players[p].id, c);
      };
    };
  };

  initializePlayers(playerCount, credits) {
    if (playerCount > 8 || playerCount < 2 || isNaN(playerCount)) {
      throw new Error(`Please enter a player count between 2 and 8.\n`);
    }
    const players = [];
    for (let i = 1; i <= playerCount; i++) {
      const playerId = `player${i}`;
      players.push(new Player(
        playerId,
        credits ? credits : 250,
        this.anteByPlayerId.bind(this, playerId),
        this.buyFromDeckByPlayerId.bind(this, playerId),
        this.swapFromDeckByPlayerIdAndCardIndex.bind(this, playerId),
        this.buyFromDiscardByPlayerId.bind(this, playerId),
        this.swapFromDiscardByPlayerIdAndCardIndex.bind(this, playerId),
        this.payPotByPlayerId.bind(this, playerId),
        this.paySabaccPotByPlayerId.bind(this, playerId),
        )
      );
    };
    return players;
  };
};
