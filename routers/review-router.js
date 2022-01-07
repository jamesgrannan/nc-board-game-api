const {
  getReview,
  patchReview,
  getAllReviews,
  getComments,
  postComment,
  deleteReview,
  postReview,
} = require("../controllers/review.controller");
const reviewRouter = require("express").Router();

reviewRouter.route("/").get(getAllReviews).post(postReview);
reviewRouter
  .route("/:review_id")
  .get(getReview)
  .patch(patchReview)
  .delete(deleteReview);
reviewRouter.route("/:review_id/comments").get(getComments).post(postComment);

module.exports = reviewRouter;
