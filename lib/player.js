'use strict';

module.exports = class Player {
  constructor(
    id,
    credits,
    ante,
    onBuyFromDeck,
    onSwapFromDeckByCardIndex,
    onBuyFromDiscard,
    onSwapFromDiscardByCardIndex,
    onPayPot,
    onPaySabaccPot,
  ) {
    this.id = id;
    this.hand = [];
    this.credits = credits
    this.ante = ante,
    this.buyFromDeck = onBuyFromDeck;
    this.swapFromDeckByCardIndex = onSwapFromDeckByCardIndex;
    this.buyFromDiscard = onBuyFromDiscard;
    this.swapFromDiscardByCardIndex = onSwapFromDiscardByCardIndex;
    this.payPot = onPayPot;
    this.paySabaccPot = onPaySabaccPot;
    this.score = {};
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
    const handValues = this.hand.map(c => c.value);
    return handValues.reduce((a,b) => a + b, 0);
  };
  setScore(score) {
    this.score = score;
  }
};
