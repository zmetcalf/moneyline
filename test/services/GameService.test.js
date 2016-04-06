var fs = require('fs'),
    sinon = require('sinon'),
    request = require('request');

describe('GameService', function() {
  describe('updateGames', function() {
    beforeEach(function(done) {
      fs.readFile('./test/services/nhl.xml', 'utf-8', function(err, file) {
        if(err) return done(err);
        sinon.stub(request, 'get', function(url, callback) {
          return callback(null, null, file);
        });
        done();
      });
    });

    afterEach(function() {
      request.get.restore();
    });

    it('should update games.', function (done) {
      GameService.updateGames(function(err, response) {
        console.log(err);
        console.log(response);
        done(err);
      });
    });
  });
});
