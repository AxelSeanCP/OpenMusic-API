const Joi = require("joi");

const ExportPlaylistsPayloadSchema = Joi.object({
  targetEmail: Joi.string().required(),
});

module.exports = { ExportPlaylistsPayloadSchema };
