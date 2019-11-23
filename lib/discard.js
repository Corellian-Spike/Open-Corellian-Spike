'use strict';

module.exports = class Discard {
  constructor() {
    this.order = [];
  }

  drawTo(player) {
    if (this.order.length < 1) {
      throw new Error('Deck is empty\n');
    };
    player.hand.push(this.order.pop());
    return player.hand;
  };

  replaceToDeck(deck) {
    deck.order = [...deck.order, ...this.order];
    this.order = [];
  };

  get top() {
    return this.order[this.order.length-1];
  };

  get infoPublic() {
    return {
      length: this.order.length,
      topCard: this.top
    };
  };
};
