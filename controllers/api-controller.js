const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res) => {
  res.status(200).send({ endpoints });
};

exports.wrongEndpoint = (req, res) => {
  res.status(404).send({ msg: "Endpoint or method doesn't exist" });
};
