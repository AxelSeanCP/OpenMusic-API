class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._sercice.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: "success",
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const playlists = await this._service.getPlaylists(credentialId);

    return {
      status: "success",
      data: {
        playlists: playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._service.deletePlaylist(id);

    return {
      status: "success",
      message: "Berhasil menghapus playlist",
    };
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.paylaod;

    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._service.addSongToPlaylist(id, { songId });

    const response = h.response({
      status: "success",
      message: "Berhasil menambahkan lagu ke playlist",
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._service.getPlaylistSongs(id);

    return {
      status: "success",
      data: {
        playlist: playlist,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.paylaod;

    await this._service.verifyPlaylistAccess(id, credentialId);
    await this._service.deleteSongOnPlaylist({ songId });

    return {
      status: "success",
      message: "Lagu berhasil dihapus dari playlist",
    };
  }
}

module.exports = PlaylistsHandler;
