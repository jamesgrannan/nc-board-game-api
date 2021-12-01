const {
  getReview,
  patchReview,
  getAllReviews,
} = require("../controllers/review.controller");
const reviewRouter = require("express").Router();

reviewRouter.get("/", getAllReviews);
reviewRouter.route("/:review_id").get(getReview).patch(patchReview);

module.exports = reviewRouter;
