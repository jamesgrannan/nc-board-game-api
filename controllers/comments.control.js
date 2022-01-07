const { removeComment, updateComment } = require("../models/comments.model");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  updateComment(comment_id, req.body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
