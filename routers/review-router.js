const { getReview } = require("../controllers/review.controller");
const reviewRouter = require("express").Router();

reviewRouter.get("/:review_id", getReview);

module.exports = reviewRouter;
