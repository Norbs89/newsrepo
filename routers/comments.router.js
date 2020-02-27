const commentsRouter = require("express").Router();
const {
  sendUpdatedComment,
  deleteComment
} = require("../controllers/comments.controller");

commentsRouter
  .route("/:comment_id")
  .patch(sendUpdatedComment)
  .delete(deleteComment);

module.exports = commentsRouter;
