const autoBind = require("auto-bind");

class ActivitiesHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async getActivitiesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._service.verifyActivitiesAccess(id, credentialId);
    const activities = await this._service.getActivities(id);

    return {
      status: "success",
      data: {
        playlistId: id,
        activities: activities,
      },
    };
  }
}

module.exports = ActivitiesHandler;
