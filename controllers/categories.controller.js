const {
  fetchCategories,
  createCategory,
} = require("../models/categories.model");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.postCategory = (req, res, next) => {
  createCategory(req.body)
    .then((category) => {
      res.status(201).send({ category });
    })
    .catch(next);
};
