'use strict';

const Game = require('./lib/game');

const game = new Game(8);
game.deck.shuffle();
game.deck.dealTo(game.players);
game.deck.discardTo(game.discard)
console.log(game.scoreActivePlayers());
