const { fetchReview } = require("../models/reviews.model");

exports.getReview = () => {
  fetchReview();
};
