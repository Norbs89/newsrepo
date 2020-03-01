const {
  getArticleById,
  changeVotes,
  postComment,
  sendCommentsByArticleId,
  sendAllArticles,
  postArticle,
  deleteArticle
} = require("../controllers/articles.controller");
const { send405Error, send404Error } = require("../errors/errors");

const articlesRouter = require("express").Router();

articlesRouter
  .route("/")
  .get(sendAllArticles)
  .post(postArticle)
  .all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(changeVotes)
  .delete(deleteArticle)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(sendCommentsByArticleId)
  .all(send405Error);

module.exports = articlesRouter;
