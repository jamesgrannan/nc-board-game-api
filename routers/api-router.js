const { getEndpoints } = require("../controllers/api-controller");
const categoryRouter = require("./category-router");
const commentRouter = require("./comment-router");
const reviewRouter = require("./review-router");
const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
