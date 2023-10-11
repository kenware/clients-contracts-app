class Response {
  static async sendSuccess (res, { message, statusCode = 200, data = null }) {
    return res.status(statusCode).send({
      status: true, message, data
    }).end()
  }

  static async sendError (res, { message, statusCode = 400, data = null }) {
    return res.status(statusCode).send({
      status: true, message, data
    }).end()
  }
}

export default Response
