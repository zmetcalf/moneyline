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
                { 'gameId': game.ID }).populateAll().exec(function(err, sysGame) {
                if(err) return _innerGameCb(err);
                _innerGameCb(null, sysGame);
              });
            },

            function(sysGame, _innerGameCb) { // Get or Create Teams
              if(!sysGame) {
                async.mapSeries(game.Event.Competitor, function(team, _teamCb) {
                  Team.findOne().where(
                    { 'bovadaTeamId': team.ID }).populateAll().exec(function(err, teamResult) {
                      if(err) return _teamCb(err);
                      if(!teamResult) {
                        Team.create({ 'bovadaTeamId': team.ID }).exec(function(err, newTeam) {
                          if(err) return _teamCb(err);
                          _teamCb(err, newTeam);
                        });
                      } else {
                        _teamCb(err, teamResult);
                      }
                    });
                  },
                function(err, teams) {
                  if(err) return _innerGameCb(err);
                  if(teams.length == 2) {
                    _innerGameCb(null, null, teams[0], teams[1]);
                  } else {
                    _innerGameCb('Invalid team count');
                  }
                });
              } else {
                _innerGameCb(null, sysGame, sysGame.teams[0], sysGame.teams[1]);
              }
            },

            function(sysGame, home, away, _innerGameCb) { // Get or Create Game
              if(sysGame) {
                _innerGameCb(null, home, away, sysGame);
              } else {
                Game.create({ teams: [ home, away ], gameId: sysGame.ID }).exec(function(err, newGame) {
                  if(err) return _innerGameCb(err);
                  _innerGameCb(null, home, away, newGame);
                });
              }
            },

            function(home, away, sysGame, _innerGameCb) { // If game done add result
              _innerGameCb(null, home, away, sysGame);
            },

            function(home, away, sysGame, _innerGameCb) {  // Check last datapoint - add if updated
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
