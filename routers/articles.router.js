const articlesRouter = require("express").Router();

articlesRouter
  .route("/:article_id")
  .get()
  .patch();

module.exports = articlesRouter;
