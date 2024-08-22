const autoBind = require("auto-bind");

class AlbumsHandler {
  constructor(service, validator, storageService, uploadsValidator) {
    this._service = service;
    this.validator = validator;
    this._storageService = storageService;
    this._uploadsValidator = uploadsValidator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this.validator.validateAlbumPayload(request.payload);
    const { name, year, coverUrl } = request.payload;

    const albumId = await this._service.addAlbum({ name, year, coverUrl });

    const response = h.response({
      status: "success",
      data: {
        albumId: albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: "success",
      data: {
        album: album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this.validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: "success",
      message: "Album berhasil diperbarui",
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    return {
      status: "success",
      message: "Album berhasil dihapus",
    };
  }

  async postAlbumLikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._service.getAlbumById(id);
    await this._service.checkAlbumLikes(id, credentialId);
    await this._service.addAlbumLikes(id, credentialId);

    const response = h.response({
      status: "success",
      message: "Berhasil menambahkan like ke album",
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._service.deleteAlbumLikes(id, credentialId);

    return {
      status: "success",
      message: "Berhasil menghapus like ke album",
    };
  }

  async getAlbumLikesHandler(request, h) {
    const { id } = request.params;

    const likes = await this._service.getAlbumLikes(id);

    if (likes.useCache) {
      const response = h.response({
        status: "success",
        data: {
          likes: likes.likes,
        },
      });
      response.code(200);
      response.header("X-Data-Source", "cache");
      return response;
    }

    return {
      status: "success",
      data: {
        likes,
      },
    };
  }

  async postAlbumCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;

    this._uploadsValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    await this._service.addAlbumCover(
      id,
      `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/${filename}`
    );

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
