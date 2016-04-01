var request = require('request'),
    xml2js = require('xml2js');

module.exports = {
  updateGames: function(callback) {
    async.waterfall([
      function(_mainCb) { // get raw xml
        request.get('http://sportsfeeds.bovada.lv/basic/NHL.xml', function(err, response, body) {
          if(err) _mainCb(err);
          _mainCb(null, body);
        });
      },

      function(xml, _mainCb) { // parse
        var parser = new xml2js.Parser();
        parser.parseString(xml, function (err, result) {
          if(err) _mainCb(err);
          _mainCb(null, result);
        });
      },

      function(xml, _mainCB) { // Game Loop
        async.each(xml.Schedule.EventType[0].Date, function(game, _gameCb) {
          async.waterfall([
            function(_innerGameCb) { // Check if game exists and is finished.
              gameQuery = Game.findOne().where(
                { 'gameId': game.ID }).exec(function(game) {
                _innerGameCb(null);
              });
            },

            function(_innerGameCb) { // Get or Create Teams
              var home, away;
              _innerGameCb(null, home, away);
            },

            function(home, away, _innerGameCb) { // Get or Create Game
              var game;
              _innerGameCb(null, home, away, game);
            },

            function(home, away, game, _innerGameCb) { // Check last datapoint - add if updated
              _innerGameCb(null, home, away, game);
            },

            function(home, away, game, _innerGameCb) { // If game done add result
              _innerGameCb(null);
            }
          ], function(err) {
            if(err) _gameCb(err);
            _gameCb(null);
          });
        }, function(err) {
          _mainCB(null);
        });
      }

    ], function(err, result) {
      if(err) callback(err);
      callback(null, result);
    });
  }
};
