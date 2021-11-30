const { getEndpoints } = require("../controllers/api-controller");
const categoryRouter = require("./category-router");
const reviewRouter = require("./review-router");
const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/reviews", reviewRouter);

module.exports = apiRouter;
