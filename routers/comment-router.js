const { wrongMethod } = require("../controllers/api-controller");
const {
  deleteComment,
  patchComment,
} = require("../controllers/comments.control");

const commentRouter = require("express").Router();

commentRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(patchComment)
  .all(wrongMethod);

module.exports = commentRouter;
