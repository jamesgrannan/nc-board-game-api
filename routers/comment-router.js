const {
  deleteComment,
  patchComment,
} = require("../controllers/comments.control");

const commentRouter = require("express").Router();

commentRouter.route("/:comment_id").delete(deleteComment).patch(patchComment);

module.exports = commentRouter;
