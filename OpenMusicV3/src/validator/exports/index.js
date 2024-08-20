const ExportPlaylistsPayloadSchema = require("./ExportsSchema");
const InvariantError = require("../../exceptions/InvariantError");

const ExportsValidator = {
  validateExportPlaylistsPayload: (payload) => {
    const validationResult = ExportPlaylistsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
