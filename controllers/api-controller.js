const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res) => {
  res.status(200).send({ endpoints });
};

exports.wrongEndpoint = (req, res) => {
  res.status(404).send({ msg: "Endpoint doesn't exist" });
};

exports.wrongMethod = (req, res) => {
  res.status(405).send({ msg: "Method doesn't exist" });
};
