const {
  getEndpoints,
  wrongEndpoint,
} = require("../controllers/api-controller");
const categoryRouter = require("./category-router");
const commentRouter = require("./comment-router");
const reviewRouter = require("./review-router");
const userRouter = require("./user-router");
const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/users", userRouter);
apiRouter.route("*").all(wrongEndpoint);

module.exports = apiRouter;
