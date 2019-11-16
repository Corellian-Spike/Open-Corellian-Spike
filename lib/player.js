'use strict';

module.exports = class Player {
  constructor(
    id,
    credits,
    onBuyFromDeck,
    onSwapFromDeck,
    onBuyFromDiscard,
    onSwapFromDiscard,
    onPayPot,
    onPaySabaccPot,
  ) {
    this.id = id;
    this.hand = [];
    this.credits = credits
    this.buyFromDeck = onBuyFromDeck;
    this.swapFromDeck = onSwapFromDeck;
    this.buyFromDiscard = onBuyFromDiscard;
    this.swapFromDiscard = onSwapFromDiscard;
    this.payPot = onPayPot;
    this.paySabaccPot = onPaySabaccPot
  };
  get infoPrivate() {
    return {
      id: this.id,
      hand: this.hand,
      sum: this.sum,
      credits: this.credits,
    };
  };
  get infoPublic() {
    return {
      id: this.id,
      hand: `${this.hand.length} cards`,
      credits: this.credits
    };
  };
  get sum() {
    let sum = 0;
    for (let cardIndex = 0; cardIndex < this.hand.length; cardIndex++) {
      sum = sum + this.hand[cardIndex].value;
    }
    return sum;
  }
};
