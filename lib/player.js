'use strict';

module.exports = class Player {
  constructor(
    id,
    credits,
  ) {
    this.id = id;
    this.credits = credits;
    this.hand = [];
    this.turnAction = {
      buyCardFromDeck: ()=>{},
      buyCardFromDiscard: ()=>{},
      swapCardFromDeckByHandIndex: (handIndex)=>{handIndex},
      swapCardFromDiscardByHandIndex: (handIndex)=>{handIndex}
    };
    this.wagerAction = {
      ante: ()=>{},
      matchCurrentWager: ()=>{},
      matchAndRaiseCurrentWagerByCredits: (credits)=>{credits},
      fold: ()=>{}
    };
    this.currentWager = 0;
    this.isActive = true;
  };

  get score() {
    const score = {
      name: undefined,
      rank: 0,
    }

    if (this.hand.length < 2) {
      return score;
    }

    if (this.hand.length > 5) {
      return score;
    }

    const handValues = this.hand.map(card => card.value);
    handValues.sort((a, b) => (a-b));
    const sum = handValues.reduce((currentSum, value) => currentSum + value, 0);

    const criteria = {
      isSabacc: sum === 0 ? 1 : 0,
      sabaccBonus: 0,
      pairBonus: 0,
      secondPairBonus: 0,
      runBonus: 0,
      nulhrekBonus: 48 - Math.abs(sum),
      isPositive: sum > 0 ? 1 : 0,
      numberOfCards: this.hand.length,
      positiveSum: handValues.reduce((currentSum, value) => (value > 0) ? currentSum + value : currentSum, 0),
      highestPositiveCard: handValues[handValues.length - 1] > 0 ? handValues[handValues.length - 1] : 0,
    };

    if (criteria.isSabacc) {
      const sabaccValues = handValues.map(card => Math.abs(card));
      const frequencies = sabaccValues.reduce((frequencyArray, value) => {
        frequencyArray[value] = frequencyArray[value] + 1;
        return frequencyArray;
      },
      [0,0,0,0,0,0,0,0,0,0,0]);

      const findRun = () => {
        for (let c = 3; c < frequencies.length; c++) {
          if (frequencies[c-3] === frequencies[c-2] === frequencies[c-1] === frequencies[c]) {
            return c;
          }
        };
        return false;
      };

      if (JSON.stringify(frequencies) === '[2,0,0,0,0,0,0,0,0,0,0]') {
        score.name = `Pure Sabacc`;
        criteria.sabaccBonus = 15;
      } else if (JSON.stringify(frequencies) === '[1,0,0,0,0,0,0,0,0,0,4]') {
        score.name = `Full Sabacc`;
        criteria.sabaccBonus = 14;
      } else if (frequencies.indexOf(4) > 0 && frequencies[0] > 0) {
        score.name = `Fleet of ${frequencies.indexOf(4)}s`;
        criteria.sabaccBonus = 13;
        criteria.pairBonus = frequencies.indexOf(4);
      } else if (frequencies.indexOf(2) > 0 && frequencies.indexOf(2, frequencies.indexOf(2) + 1) > 0 && frequencies[0] > 0) {
        score.name = `Dual Power Coupling of ${frequencies.indexOf(2)}s & ${frequencies.indexOf(2, frequencies.indexOf(2) + 1)}s`;
        criteria.sabaccBonus = 12;
        criteria.pairBonus = frequencies.indexOf(2);
        criteria.secondPairBonus = frequencies.indexOf(2, frequencies.indexOf(2) + 1);
      } else if (frequencies.indexOf(2) > 0 && frequencies[0] > 0) {
        score.name = `Power Coupling (Yee-Haa) of ${frequencies.indexOf(2)}s`;
        criteria.sabaccBonus = 11;
        criteria.pairBonus = frequencies.indexOf(2);
        criteria.secondPairBonus = frequencies.indexOf(2, frequencies.indexOf(2) + 1);
      } else if (frequencies.indexOf(3) > 0 && frequencies.indexOf(2, frequencies.indexOf(3) + 1) > 0) {
        score.name = `Rhylet of ${frequencies.indexOf(3)}s & ${frequencies.indexOf(2, frequencies.indexOf(3) + 1)}s`
        criteria.sabaccBonus = 10;
        criteria.pairBonus = frequencies.indexOf(3);
        criteria.secondPairBonus = frequencies.indexOf(2, frequencies.indexOf(3) + 1);
      } else if (JSON.stringify(frequencies) === '[0,0,0,0,0,0,0,1,1,1,1]') {
        score.name = `Straight Staves (${criteria.highestPositiveCard === 10 ? criteria.highestPositiveCard : criteria.highestNegativeCard})`;
        criteria.sabaccBonus = 9;
      } else if (frequencies.indexOf(4) > 0) {
        score.name = `Squadron of ${frequencies.indexOf(4)}s`;
        criteria.sabaccBonus = 8;
        criteria.pairBonus = frequencies.indexOf(4);
      } else if (findRun()) {
        score.name = `Straight Khyron (${findRun()})`;
        criteria.sabaccBonus = 7;
        criteria.runBonus = 10 - findRun();
      } else if (JSON.stringify(frequencies) === '[0,1,1,1,1,0,0,0,0,0,1]') {
        score.name = `Wizard (Gee Whiz) (${criteria.highestPositiveCard === 10 ? criteria.highestPositiveCard : criteria.highestNegativeCard})`;
        criteria.sabaccBonus = 6;
      } else if (frequencies.indexOf(3) > 0) {
        score.name = `Banthas Wild of ${frequencies.indexOf(3)}s`;
        criteria.sabaccBonus = 5;
        criteria.pairBonus = frequencies.indexOf(3);
      } else if (frequencies.indexOf(2) >= 0 && frequencies.indexOf(2, frequencies.indexOf(2) + 1) > 0){
        score.name = `Dual Pair Sabacc (${frequencies.indexOf(2)}s & ${frequencies.indexOf(2, frequencies.indexOf(2) + 1)})`;
        criteria.sabaccBonus = 4;
        criteria.pairBonus = frequencies.indexOf(2);
        criteria.secondPairBonus = frequencies.indexOf(2, frequencies.indexOf(2) + 1);
      } else if (frequencies.indexOf(2) >= 0 && frequencies.indexOf(2, frequencies.indexOf(2) + 1) > 0){
        score.name = `Single Pair Sabacc (${frequencies.indexOf(2)}s)`;
        criteria.sabaccBonus = 3;
        criteria.pairBonus = frequencies.indexOf(2);
      } else {
        score.name = `Sabacc (${criteria.positiveSum})`;
        criteria.sabaccBonus = 2;
      }
    } else if (!criteria.isSabacc) {
      score.name = `Nulhrek (${sum})`;
    }

    const twoDigits = (input) => {
      return input.toString().length === 2 ? input.toString() : '0' + input.toString()
    }

    score.rank = parseInt(
      twoDigits(criteria.isSabacc) +
      twoDigits(criteria.sabaccBonus) +
      twoDigits(criteria.pairBonus) +
      twoDigits(criteria.secondPairBonus) +
      twoDigits(criteria.runBonus) +
      twoDigits(criteria.nulhrekBonus) +
      twoDigits(criteria.isPositive) +
      twoDigits(criteria.numberOfCards) +
      twoDigits(criteria.positiveSum) +
      twoDigits(criteria.highestPositiveCard)
    );

    return score;
  };

  get infoPrivate() {
    return {
      id: this.id,
      hand: this.hand,
      score: this.score.name,
      isActive: this.isActive,
      currentWager: this.currentWager,
      credits: this.credits,
    };
  };
  get infoPublic() {
    return {
      id: this.id,
      hand: `${this.hand.length} cards`,
      isActive: this.isActive,
      currentWager: this.currentWager,
      credits: this.credits
    };
  };
};
