const getArticleById = require("../controllers/articles.controller");
const articlesRouter = require("express").Router();

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch();

module.exports = articlesRouter;
