describe('GameService', function() {
  describe('updateGames', function() {
    it('should update games.', function (done) {
      GameService.updateGames(function(err, response) {
        console.log(response);
        done();
      });
    });
  });

});
