const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthorizationError = require("../exceptions/AuthorizationError");

class ActivitiesService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async addActivities(playlistId, userId, { songId }, action) {
    const id = `PSA-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: "INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING playlist_song_activities_id",
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].playlist_song_activities_id) {
      throw new InvariantError("Activities gagal ditambahkan");
    }
  }

  async getActivities(id) {
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time
        FROM playlist_song_activities psa
        LEFT JOIN playlists p ON p.playlist_id = psa.playlist_id
        LEFT JOIN users u ON u.user_id = psa.user_id
        LEFT JOIN songs s ON s.song_id = psa.song_id
        WHERE p.playlist_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    console.log(result);

    if (!result.rows.length) {
      throw new NotFoundError("Activities tidak ditemukan");
    }

    return result.rows;
  }

  async verifyActivitiesOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlist_song_activities WHERE playlist_id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Resource yang anda minta tidak ditemukan");
    }

    const activities = result.rows[0];

    if (activities.user_id !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyActivitiesAccess(id, owner) {
    try {
      await this.verifyActivitiesOwner(id, owner);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationsService.verifyCollaborator(
          playlistId,
          userId
        );
      } catch {
        throw error;
      }
    }
  }
}

module.exports = ActivitiesService;
