const { wrongMethod } = require("../controllers/api-controller");
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

reviewRouter.route("/").get(getAllReviews).post(postReview).all(wrongMethod);
reviewRouter
  .route("/:review_id")
  .get(getReview)
  .patch(patchReview)
  .delete(deleteReview)
  .all(wrongMethod);
reviewRouter
  .route("/:review_id/comments")
  .get(getComments)
  .post(postComment)
  .all(wrongMethod);

module.exports = reviewRouter;
