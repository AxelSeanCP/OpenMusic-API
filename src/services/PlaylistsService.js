const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthorizationError = require("../exceptions/AuthorizationError");

const { mapPlaylistsToModel, mapSongToModel } = require("../utils");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  // Playlist Service
  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES ($1, $2, $3) RETURNING playlist_id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].playlist_id) {
      throw new InvariantError("Gagal menambahkan playlist");
    }

    return result.rows[0].playlist_id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT p.playlist_id, p.name, u.username
      FROM playlist p
      LEFT JOIN users u ON u.user_id = p.owner
      WHERE p.owner = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapPlaylistsToModel);
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT p.*, u.username
        FROM playlist p
        LEFT JOIN users u ON u.user_id = p.owner
        WHERE p.playlist_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    return result.rows.map(mapPlaylistsToModel)[0];
  }

  async deletePlaylist(id) {
    const query = {
      text: "DELETE FROM playlists WHERE playlist_id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal menghapus playlist. Id tidak ditemukan");
    }
  }

  // Playlist_Songs Service
  async addSongToPlaylist(playlistId, { songId }) {
    const id = `playlist-songs-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING playlist_songs_id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].playlist_songs_id) {
      throw new InvariantError("Gagal menambahkan lagu ke playlist");
    }
  }

  async getPlaylistSongs(playlistId) {
    const playlist = this.getPlaylistById(playlistId);

    const query = {
      text: `SELECT s.song_id, s.title, s.performer
      FROM songs s
      INNER JOIN playlist_song ps ON ps.song_id = s.song_id
      WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    const songs = result.rows.map(mapSongToModel);

    return {
      ...playlist,
      songs: songs.length ? songs : [],
    };
  }

  async deleteSongOnPlaylist({ songId }) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE song_id = $1",
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal menghapus lagu. Id tidak ditemukan");
    }
  }

  // Verifying
  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE playlist_id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Resource yang anda minta tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        // await this._collaborationsService.verifyCollaborator(
        //   playlistId,
        //   userId
        // );
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
