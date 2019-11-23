'use strict';

const Discard = require('./discard');

describe('Discard', () => {
  describe('constructor', () => {
    it('returns a new Discard as expected', () => {
      const discard = new Discard();
      expect(discard).toMatchObject({order: []});
    });
  });
  describe('get functions', () => {
    describe('infoPublic', () => {
      it('returns object with expected fields', () => {
        const mockDiscardOrder = [
          {value: 1, id: '1'},
          {value: -3, id: '-3'}
        ];
        const discard = new Discard();
        discard.order = mockDiscardOrder;
        expect(discard.infoPublic).toMatchObject({
          length: 2,
          topCard: mockDiscardOrder[mockDiscardOrder.length - 1]
        });
      });
    });
    describe('top', () => {
      it('returns top card', () => {
        const mockDiscardOrder = [
          {value: 1, id: '1'},
          {value: -3, id: '-3'}
        ];
        const discard = new Discard();
        discard.order = mockDiscardOrder;
        expect(discard.top).toMatchObject(mockDiscardOrder[mockDiscardOrder.length - 1]);
      });
    });
  });
  describe('functions', () => {
    describe('replaceToDeck', () => {
      const mockDiscardOrder = [
        {value: 1, id: '1'},
        {value: -3, id: '-3'}
      ];
      const discard = new Discard();
      discard.order = mockDiscardOrder;
      const mockDeck = {
        order: [
          {value: 2, id: '2'}
        ]
      };
      discard.replaceToDeck(mockDeck);
      it('adds the discard pile to the top of the deck', () => {
        expect(mockDeck.order).toMatchObject([
          {value: 2, id: '2'},
          {value: 1, id: '1'},
          {value: -3, id: '-3'}
        ]);
      });
      it('removes all cards from the discard pile', () => {
        expect(discard.order.length).toBe(0);
      });
    });
    describe('drawTo', () => {
      const mockDiscardOrder = [
        {value: 1, id: '1'},
        {value: -3, id: '-3'}
      ];
      const discard = new Discard();
      discard.order = mockDiscardOrder;
      const mockPlayer = {
        hand: [
          {value: 7, id: '-7'},
          {value: 4, id: '-4'}
        ]
      };
      discard.drawTo(mockPlayer);
      it('adds the top card to the players hand', () => {
        expect(mockPlayer.hand).toMatchObject([
          {value: 7, id: '-7'},
          {value: 4, id: '-4'},
          {value: -3, id: '-3'}
        ]);
      });
      it('removes the top card from the discard', () => {
        expect(discard.order).toMatchObject([
          {value: 1, id: '1'}
        ]);
      });
      it('throws an error if the discard pile is empty', () => {
        const mockPlayerTwo = {
          hand: [
            {value: 7, id: '-7'},
            {value: 4, id: '-4'}
          ]
        };
        const emptyDiscard = new Discard();
        expect(() => {
          emptyDiscard.drawTo(mockPlayerTwo);
        }).toThrow('Deck is empty\n');
      });
    });
  });
});
