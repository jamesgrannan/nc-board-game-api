const {
  getCategories,
  postCategory,
} = require("../controllers/categories.controller");
const categoryRouter = require("express").Router();

categoryRouter.route("/").get(getCategories).post(postCategory);

module.exports = categoryRouter;
