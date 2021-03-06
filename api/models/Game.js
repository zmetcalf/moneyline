/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    gameId: 'integer',
    teams: {
      collection: 'team',
      via: 'games',
    },
    lines: {
      collection: 'gameDataPoint',
      via: 'game'
    },
    gameResults: {
      collection: 'gameResult',
      via: 'game'
    }
  }
};
