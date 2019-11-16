'use strict';

module.exports = class Discard {
  constructor() {
    this.order = [];
  }
  get top() {
    return this.order[this.order.length-1];
  };

  draw() {
    if (this.order.length < 1) {
      throw new Error('Discard is empty\n');
    };
    return this.order.pop();
  };
  discard(card) {
    this.order.push(card);
    return this.top;
  };
};
