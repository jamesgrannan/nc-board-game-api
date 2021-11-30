const { getCategories } = require("../controllers/categories.controller");
const categoryRouter = require("express").Router();

categoryRouter.get("/", getCategories);

module.exports = categoryRouter;
