'use strict';

const Game = require('./lib/game');

const game = new Game(4);
console.log(game.start());
game.players[game.state.turnIndex].wagerAction.ante();
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.fold();
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.ante();
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.ante();
console.log(game.continue());
game.deck.shuffle();
console.log(game.continue());
game.deck.dealTo(game.activePlayers);
game.deck.discardTo(game.discard);
console.log(game.continue());
game.players[game.state.turnIndex].turnAction.buyCardFromDeck();
console.log(game.continue());
game.players[game.state.turnIndex].turnAction.buyCardFromDiscard();
console.log(game.continue());
game.players[game.state.turnIndex].turnAction.swapCardFromDeckByHandIndex(0);
console.log(game.continue());
console.log(game.spikeDice.roll());
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.matchCurrentWager();
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.matchAndRaiseCurrentWagerByCredits(10);
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.matchCurrentWager();
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.matchCurrentWager();
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.matchCurrentWager();
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.matchCurrentWager();
console.log(game.continue());
game.players[game.state.turnIndex].turnAction.swapCardFromDiscardByHandIndex(2);
console.log(game.continue());
console.log(game.continue());
game.players[game.state.turnIndex].turnAction.buyCardFromDeck();
console.log(game.continue());
console.log(game.spikeDice.roll());
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.matchAndRaiseCurrentWagerByCredits(10);
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.matchCurrentWager();
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.fold();
console.log(game.continue());
game.players[game.state.turnIndex].turnAction.buyCardFromDeck();
console.log(game.continue());
console.log(game.continue());
console.log(game.spikeDice.roll());
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.matchAndRaiseCurrentWagerByCredits(20);
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.matchAndRaiseCurrentWagerByCredits(20);
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.matchCurrentWager();
console.log(game.continue());
game.players[game.state.turnIndex].wagerAction.matchCurrentWager();
console.log(game.continue());
console.log(game.scoreActivePlayers());
console.log(game.awardWinner());
console.log(game.end());
