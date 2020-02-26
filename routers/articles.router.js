const {
  getArticleById,
  changeVotes,
  postComment,
  sendCommentsByArticleId
} = require("../controllers/articles.controller");
const articlesRouter = require("express").Router();

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(changeVotes);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(sendCommentsByArticleId);
module.exports = articlesRouter;
