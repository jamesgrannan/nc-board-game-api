const {
  getReview,
  patchReview,
  getAllReviews,
  getComments,
} = require("../controllers/review.controller");
const reviewRouter = require("express").Router();

reviewRouter.get("/", getAllReviews);
reviewRouter.route("/:review_id").get(getReview).patch(patchReview);
reviewRouter.get("/:review_id/comments", getComments);

module.exports = reviewRouter;
