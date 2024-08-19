class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);

    const message = {
      playlistId: request.params.id,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage("export:notes", JSON.stringify(message));

    const response = h.response({
      status: "success",
      message: "Permintaan anda sedang kami proses",
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
