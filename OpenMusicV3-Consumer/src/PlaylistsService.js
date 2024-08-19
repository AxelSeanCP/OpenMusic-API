const { Pool } = require("pg");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT p.playlist_id as id, p.name
      FROM playlists p
      LEFT JOIN users u ON u.user_id = p.owner
      WHERE p.playlist_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getPlaylistSongs(playlistId) {
    const playlist = await this.getPlaylistById(playlistId);

    const query = {
      text: `SELECT s.song_id, s.title, s.performer
      FROM songs s
      INNER JOIN playlist_songs ps ON ps.song_id = s.song_id
      WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    const songs = result.rows;

    return {
      ...playlist,
      songs: songs.length ? songs : [],
    };
  }
}

module.exports = PlaylistsService;
