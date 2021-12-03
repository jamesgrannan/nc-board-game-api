const { deleteComment } = require("../controllers/comments.control");

const commentRouter = require("express").Router();

commentRouter.delete("/:comment_id", deleteComment);

module.exports = commentRouter;
