const {
  getReview,
  patchReview,
  getAllReviews,
  getComments,
  postComment,
} = require("../controllers/review.controller");
const reviewRouter = require("express").Router();

reviewRouter.get("/", getAllReviews);
reviewRouter.route("/:review_id").get(getReview).patch(patchReview);
reviewRouter.route("/:review_id/comments").get(getComments).post(postComment);

module.exports = reviewRouter;
