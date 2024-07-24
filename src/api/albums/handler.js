class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this.validator = validator;

    // Menetapkan konteks "this" supaya "this" pada kelas ini tidak dianggap kelas lain
  }

  async postAlbumHandler(request, h) {}

  async getAlbumsHandler() {}
}

module.exports = AlbumsHandler;
