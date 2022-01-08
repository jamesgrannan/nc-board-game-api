const { wrongMethod } = require("../controllers/api-controller");
const {
  getCategories,
  postCategory,
} = require("../controllers/categories.controller");
const categoryRouter = require("express").Router();

categoryRouter
  .route("/")
  .get(getCategories)
  .post(postCategory)
  .all(wrongMethod);

module.exports = categoryRouter;
