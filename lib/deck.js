'use strict';

module.exports = class Deck {
  constructor() {
    this.order = [
      {value: 0, id: '0SilopA'},
      {value: 0, id: '0SilopB'},
    ];

    const staves = [
      'Triangle',
      'Circle',
      'Square'
    ];

    staves.map((stave)=>{
      for (let i = 1; i <= 10; i++) {
        this.order.push({value:i, id:`${i}${stave}`})
      };
    });

    staves.map((stave)=>{
      for (let i = -1; i >= -10; i--) {
        this.order.push({value:i, id:`${i}${stave}`})
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
  draw() {
    if (this.order.length < 1) {
      throw new Error('Deck is empty\n');
    };
    return this.order.pop();
  };
};
