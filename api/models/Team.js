/**
* Team.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    bovadaTeamId: 'string',
    games: {
      collection: 'game',
      via: 'teams'
    },
    gameDataPoints: {
      collection: 'gameDataPoint',
      via: 'team'
    },
    gameResults: {
      collection: 'gameResult',
      via: 'team'
    }
  }
};

