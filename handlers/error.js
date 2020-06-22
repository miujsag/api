const { logError } = require("logger");

function handleError(error, request, response, next) {
  console.log(error);
  logError(error);

  response.status(500).json({ message: "Server error" });
}

function notFound(request, response) {
  response.status(404).json({ message: "Resource not found" });
}

module.exports = {
  handleError,
  notFound,
};
