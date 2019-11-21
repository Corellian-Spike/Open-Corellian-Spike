'use strict';

const Card = require('./card')

module.exports = class Deck {
  constructor() {
    this.order = [
      new Card(0, '0SilopA'),
      new Card(0, '0SilopB'),
    ];

    const staves = [
      'Triangle',
      'Circle',
      'Square'
    ];

    staves.map((stave)=>{
      for (let value = 1; value <= 10; value++) {
        this.order.push(new Card(value, `${value}${stave}`));
      };
    });

    staves.map((stave)=>{
      for (let value = -1; value >= -10; value--) {
        this.order.push(new Card(value, `${value}${stave}`));
      };
    });
  };

  shuffle() {
    for (let i = this.order.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.order[i], this.order[j]] = [this.order[j], this.order[i]];
    };
    return this.order;
  };

  drawTo(player) {
    if (this.order.length < 1) {
      throw new Error('Deck is empty\n');
    };
    player.hand.push(this.order.pop());
    return player.hand;
  };

  dealTo(playersArray) {
    for (let card = 0; card < 2; card++) {
      for (let player = 0; player < playersArray.length; player++) {
        this.drawTo(playersArray[player]);
      };
    };
  };

  dealReplacementHandTo(player, handLength) {
    for (let card = 0; card < handLength; card++) {
      this.drawTo(player);
    };
  };

  discardTo(discard) {
    discard.order.push(this.order.pop());
    return discard.top;
  };

  get infoPublic() {
    return {
      length: this.order.length,
    };
  };
};
