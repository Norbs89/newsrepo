const {
  getArticleById,
  changeVotes
} = require("../controllers/articles.controller");
const articlesRouter = require("express").Router();

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(changeVotes);

module.exports = articlesRouter;
