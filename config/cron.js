module.exports.cron = {
  updateGames: {
    schedule: '*/15 * * * *',
    onTick: function() {
      GameService.updateGames();
    }
  }
}
