const CustomAPIError = require("./custom-error");
const BadRequestError = require("./bad-request");
const UnAuthenticatedError = require("./unauthenticated");
const NotFoundError = require("./not-found");

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnAuthenticatedError,
  NotFoundError,
};
