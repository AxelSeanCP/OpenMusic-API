const { Pool } = require("pg");
const { nanoid } = require("nanoid");

const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

const { mapSongToModel, mapSongsToModel } = require("../utils");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING song_id",
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].song_id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return result.rows[0].song_id;
  }

  async getSongs({ title, performer }) {
    const query = {
      text: "SELECT song_id, title, performer FROM songs",
      values: [],
    };

    // query parameters
    if (title || performer) {
      query.text += " WHERE ";

      const conditions = [];
      if (title) {
        conditions.push("title ILIKE $1");
        query.values.push(`%${title}%`);
      }
      if (performer) {
        conditions.push(`performer ILIKE $${query.values.length + 1}`);
        query.values.push(`%${performer}%`);
      }

      query.text += conditions.join(" AND ");
    }

    const result = await this._pool.query(query);

    return result.rows.map(mapSongsToModel);
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs where song_id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows.map(mapSongToModel)[0];
  }

  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5",
      values: [title, year, performer, genre, duration],
    };

    if (albumId) {
      query.text += ", album_id = $6 WHERE song_id = $7 RETURNING song_id";
      query.values.push(albumId, id);
    } else {
      query.text += " WHERE song_id = $6 RETURNING song_id";
      query.values.push(id);
    }

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE song_id = $1 RETURNING song_id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal menghapus lagu. Id tidak ditemukan");
    }
  }
}

module.exports = SongsService;
