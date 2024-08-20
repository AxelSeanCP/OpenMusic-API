const { Pool } = require("pg");
const { nanoid } = require("nanoid");

const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

const { mapAlbumToModel, mapSongsToModel } = require("../utils");

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO albums VALUES ($1, $2, $3) RETURNING album_id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].album_id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].album_id;
  }

  async getAlbumById(id) {
    const albumQuery = {
      text: "SELECT * FROM albums WHERE album_id = $1",
      values: [id],
    };

    const albumResult = await this._pool.query(albumQuery);

    if (!albumResult.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const songsQuery = {
      text: "SELECT song_id, title, performer FROM songs WHERE album_id = $1",
      values: [id],
    };

    const songsResult = await this._pool.query(songsQuery);

    const albums = albumResult.rows.map(mapAlbumToModel)[0];
    const songs = songsResult.rows.map(mapSongsToModel);

    return {
      ...albums,
      songs: songs.length ? songs : [],
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE album_id = $3 RETURNING album_id",
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE album_id = $1 RETURNING album_id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }

  async addAlbumLikes(albumId, userId) {
    const id = `likes-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO user_album_likes VALUES ($1, $2, $3)",
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError("Gagal menambahkan like ke album");
    }
  }

  async deleteAlbumLikes(albumId, userId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2",
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError("Gagal menghapus like ke album");
    }
  }

  async getAlbumLikes(albumId) {
    const query = {
      text: `SELECT count(user_id) as likes
      FROM user_album_likes l
      WHERE l.album_id = $1`,
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal mendapatkan like dari album");
    }

    //convert into int
    const count = parseInt(result.rows[0].likes, 10);

    return count;
  }

  async checkAlbumLikes(albumId, userId) {
    const query = {
      text: "SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2",
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError("Album sudah di like oleh user ini");
    }
  }
}

module.exports = AlbumsService;
