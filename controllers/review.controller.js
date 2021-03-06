const {
  fetchReview,
  updateReview,
  fetchAllReviews,
  fetchComments,
  createComment,
  removeReview,
  createReview,
} = require("../models/reviews.model");

exports.getReview = (req, res, next) => {
  const { review_id } = req.params;
  fetchReview(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  updateReview(review_id, req.body)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getAllReviews = (req, res, next) => {
  fetchAllReviews(req.query)
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  fetchComments(review_id, req.query)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  createComment(req.body, review_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteReview = (req, res, next) => {
  const { review_id } = req.params;
  removeReview(review_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.postReview = (req, res, next) => {
  createReview(req.body)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch(next);
};
