'use strict';

const Game = require('./lib/game');

const game = new Game(2);

console.log('\nSTART GAME');
game.start();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
game.table.deck.shuffle();
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
game.table.players[0].ante();
console.log('\tpot:', game.table.pot, '| sabacc pot:', game.table.sabaccPot);
console.log('\tplayer1 remaining credits:', game.table.players[0].credits);
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
game.table.players[1].ante();
console.log('\tpot:', game.table.pot, '| sabacc pot:', game.table.sabaccPot);
console.log('\tplayer2 remaining credits:', game.table.players[0].credits);
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
game.table.deal();
console.log('\tdiscard top:', game.table.discard.top.value);
console.log('\tplayer 1 hand:', game.table.players[0].hand[0].value, game.table.players[0].hand[1].value, '| sum:', game.table.players[0].sum);
console.log('\tplayer 2 hand:', game.table.players[1].hand[0].value, game.table.players[1].hand[1].value, '| sum:', game.table.players[1].sum);
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
game.table.players[0].buyFromDeck();
console.log('   PLAYER 1 BUYS CARD FROM DECK');
console.log('\tpot:', game.table.pot, '| sabacc pot:', game.table.sabaccPot);
console.log('\tplayer1 remaining credits:', game.table.players[0].credits);
console.log('\tplayer 1 hand:', game.table.players[0].hand[0].value, game.table.players[0].hand[1].value, game.table.players[0].hand[2].value, '| sum:', game.table.players[0].sum);
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
game.table.players[1].swapFromDeckByCardIndex(1);
console.log('   PLAYER 2 SWAPS CARD FROM DECK');
console.log('\tdiscard top:', game.table.discard.top.value);
console.log('\tplayer 2 hand:', game.table.players[1].hand[0].value, game.table.players[1].hand[1].value, '| sum:', game.table.players[1].sum);
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
let spike = game.table.rollSpikeDice();
console.log('   SPIKE ROLL:', spike.rollOne, spike.rollTwo);
if (spike.spikeDiceMatch) {
  console.log('   DICE MATCH, NEW HANDS ARE DRAWN:');
  game.table.spikeHandSwap();
} else {
  console.log('   DICE DO NOT MATCH, PLAY CONTINUES:');
}
console.log('\tplayer 1 hand:', game.table.players[0].hand[0].value, game.table.players[0].hand[1].value, game.table.players[0].hand[2].value, '| sum:', game.table.players[0].sum);
console.log('\tplayer 2 hand:', game.table.players[1].hand[0].value, game.table.players[1].hand[1].value, '| sum:', game.table.players[1].sum);
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
console.log('   (betting not yet implemented)');
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
console.log('   (betting not yet implemented)');
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
game.table.players[0].swapFromDiscardByCardIndex(0);
console.log('   PLAYER 1 SWAPS CARD FROM DISCARD');
console.log('\tdiscard top:', game.table.discard.top.value);
console.log('\tplayer 1 hand:', game.table.players[0].hand[0].value, game.table.players[0].hand[1].value, game.table.players[0].hand[2].value, '| sum:', game.table.players[0].sum);
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
game.table.players[1].buyFromDiscard();
console.log('   PLAYER 2 BUYS TOP CARD FROM DISCARD');
console.log('\tdiscard top:', game.table.discard.top.value);
console.log('\tplayer 2 hand:', game.table.players[1].hand[0].value, game.table.players[1].hand[1].value, game.table.players[1].hand[2].value, '| sum:', game.table.players[1].sum);
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
spike = game.table.rollSpikeDice();
console.log('   SPIKE ROLL:', spike.rollOne, spike.rollTwo);
if (spike.spikeDiceMatch) {
  console.log('   DICE MATCH, NEW HANDS ARE DRAWN:');
  game.table.spikeHandSwap();
} else {
  console.log('   DICE DO NOT MATCH, PLAY CONTINUES:');
}
console.log('\tplayer 1 hand:', game.table.players[0].hand[0].value, game.table.players[0].hand[1].value, game.table.players[0].hand[2].value, '| sum:', game.table.players[0].sum);
console.log('\tplayer 2 hand:', game.table.players[1].hand[0].value, game.table.players[1].hand[1].value, '| sum:', game.table.players[1].sum);
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
console.log('   (betting not yet implemented)');
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
console.log('   (betting not yet implemented)');
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
console.log('   PLAYER 1 STANDS');
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
game.table.players[1].buyFromDeck();
console.log('   PLAYER 2 BUYS CARD FROM DECK');
console.log('\tpot:', game.table.pot, '| sabacc pot:', game.table.sabaccPot);
console.log('\tplayer2 remaining credits:', game.table.players[1].credits);
console.log('\tplayer 2 hand:', game.table.players[1].hand[0].value, game.table.players[1].hand[1].value, game.table.players[1].hand[2].value, game.table.players[1].hand[3].value, '| sum:', game.table.players[1].sum);
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
spike = game.table.rollSpikeDice();
console.log('   SPIKE ROLL:', spike.rollOne, spike.rollTwo);
if (spike.spikeDiceMatch) {
  console.log('   DICE MATCH, NEW HANDS ARE DRAWN:');
  game.table.spikeHandSwap();
} else {
  console.log('   DICE DO NOT MATCH, PLAY CONTINUES:');
}
console.log('\tplayer 1 hand:', game.table.players[0].hand[0].value, game.table.players[0].hand[1].value, game.table.players[0].hand[2].value, '| sum:', game.table.players[0].sum);
console.log('\tplayer 2 hand:', game.table.players[1].hand[0].value, game.table.players[1].hand[1].value, '| sum:', game.table.players[1].sum);
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
console.log('   (betting not yet implemented)');
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
console.log('   (betting not yet implemented)');
game.loopStep();
console.log('\n', 'round:', game.round, '| phase:', game.phase, '| turn:', game.turn);
game.scoreHands();
console.log('\tplayer 1 hand:', game.table.players[0].hand[0].value, game.table.players[0].hand[1].value, game.table.players[0].hand[2].value, '| sum:', game.table.players[0].sum);
console.log('\t\tscore:', game.table.players[0].score.name);
console.log('\tplayer 2 hand:', game.table.players[1].hand[0].value, game.table.players[1].hand[1].value, game.table.players[1].hand[2].value, game.table.players[1].hand[3].value, '| sum:', game.table.players[1].sum);
console.log('\t\tscore:', game.table.players[1].score.name);
console.log('\n', game.winner.id, 'wins with', game.winner.score.name);
