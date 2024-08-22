const { Pool } = require("pg");
const { nanoid } = require("nanoid");

const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

const { mapAlbumToModel, mapSongsToModel } = require("../utils");

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year, coverUrl }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO albums VALUES ($1, $2, $3, $4) RETURNING album_id",
      values: [id, name, year, coverUrl],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].album_id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    await this._cacheService.delete(`album:${id}`);
    return result.rows[0].album_id;
  }

  async getAlbumById(id) {
    try {
      const result = await this._cacheService.get(`album:${id}`);
      return JSON.parse(result);
    } catch {
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

      const albumData = {
        ...albums,
        songs: songs.length ? songs : [],
      };

      await this._cacheService.set(`album:${id}`, JSON.stringify(albumData));

      return albumData;
    }
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

    await this._cacheService.delete(`album:${id}`);
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

    await this._cacheService.delete(`album:${id}`);
  }

  // Album Likes services
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

    await this._cacheService.delete(`likes:${albumId}`);
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

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return { likes: JSON.parse(result), useCache: true };
    } catch {
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

      // set into cache
      await this._cacheService.set(`likes:${albumId}`, count);

      return count;
    }
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

  // Album cover services
  async addAlbumCover(albumId, cover) {
    const query = {
      text: "UPDATE albums SET cover_url = $1 WHERE album_id = $2",
      values: [cover, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError("Gagal upload album");
    }

    await this._cacheService.delete(`album:${albumId}`);
  }
}

module.exports = AlbumsService;
