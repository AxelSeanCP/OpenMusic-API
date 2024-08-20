class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );

      const playlistSongs = await this._playlistsService.getPlaylistSongs(
        playlistId
      );
      console.log(playlistSongs);
      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(playlistSongs)
      );
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
