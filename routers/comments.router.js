const commentsRouter = require("express").Router();
const {
  sendUpdatedComment,
  deleteComment
} = require("../controllers/comments.controller");

const { send405Error, send404Error } = require("../errors/errors");

commentsRouter
  .route("/:comment_id")
  .patch(sendUpdatedComment)
  .delete(deleteComment)
  .all(send405Error);

module.exports = commentsRouter;
