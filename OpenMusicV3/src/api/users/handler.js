class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this.validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    this.validator.validateUserPayload(request.payload);

    const { username, password, fullname } = request.payload;
    const userId = await this._service.addUser({
      username,
      password,
      fullname,
    });

    const response = h.response({
      status: "success",
      data: {
        userId: userId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
