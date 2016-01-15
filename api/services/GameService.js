var request = require('request');
var parseString = require('xml2js').parseString;

module.exports = {
  updateGames: function() {
    request('http://sportsfeeds.bovada.lv/basic/NHL.xml', function(error, response, body) {

    });
  }
};
