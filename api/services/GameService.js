var request = require('request');
var parseString = require('xml2js').parseString;

module.exports = {
  updateGames: function(callback) {
    async.waterfall([
      function(_seriesCb) {
        request('http://sportsfeeds.bovada.lv/basic/NHL.xml', function(err, response, body) {
          if(err) _seriesCb(err);
          _seriesCb(null, body);
        });
      },
      function(xml, _seriesCb) {
        _seriesCb(xml);
      }
    ], function(err, result) {
      if(err) callback(err);
      callback(null, result);
    });
  }
};
