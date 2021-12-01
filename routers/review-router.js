const { getReview, patchReview } = require("../controllers/review.controller");
const reviewRouter = require("express").Router();

reviewRouter.route("/:review_id").get(getReview).patch(patchReview);

module.exports = reviewRouter;
