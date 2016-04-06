var request = require('request'),
    xml2js = require('xml2js');

module.exports = {
  updateGames: function(callback) {
    async.waterfall([
      function(_mainCb) { // get raw xml
        request.get('http://sportsfeeds.bovada.lv/basic/NHL.xml', function(err, response, body) {
          if(err) return _mainCb(err);
          _mainCb(null, body);
        });
      },

      function(xml, _mainCb) { // parse
        var parser = new xml2js.Parser();
        parser.parseString(xml, function (err, result) {
          if(err) return _mainCb(err);
          _mainCb(null, result);
        });
      },

      function(xml, _mainCB) { // Game Loop
        async.each(xml.Schedule.EventType[0].Date, function(game, _gameCb) {
          async.waterfall([
            function(_innerGameCb) { // Check if game exists.
              Game.findOne().where(
                { 'gameId': game.ID }).populateAll().exec(function(err, gameResult) {
                if(err) return _innerGameCb(err);
                _innerGameCb(null, gameResult);
              });
            },

            function(gameResult, _innerGameCb) { // Get or Create Teams
              if(gameResult) {
                async.each(game.Event.Competitor, function(team, _teamCb) {
                  Team.findOne().where(
                    { 'bovadaTeamId': team.ID }).populateAll().exec(function(err, teamResult) {
                      if(err) return _teamCb(err);
                      _teamCb(err, teamResult);
                    });
                  },
                function(err) {
                  if(err) return _innerGameCb(err);
                  // Verify Teams Exist
                  _innerGameCb(null, null);
                });
              } else {
                var home, away;
                _innerGameCb(null, gameResult);
              }
            },

            function(gameResult, _innerGameCb) { // Get or Create Game
              var home, away;
              if(gameResult) {
                _innerGameCb(null, home, away, gameResult);
              } else {

                _innerGameCb(null, home, away, gameResult);
              }
            },

            function(home, away, gameResult, _innerGameCb) { // If game done add result
              _innerGameCb(null, home, away, gameResult);
            },

            function(home, away, gameResult, _innerGameCb) {  // Check last datapoint - add if updated
              _innerGameCb(null);
            },

          ], function(err) {
            if(err) return _gameCb(err);
            _gameCb(null);
          });
        }, function(err) {
          _mainCB(null);
        });
      }

    ], function(err) {
      if(err) return callback(err);
      callback(null, 'Done');
    });
  }
};
