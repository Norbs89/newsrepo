const apiRouter = require("express").Router();

const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");
const endpoints = require("../endpoints.json");

const endPoints = () => {
  console.log({ endpoints });
  return { endpoints };
};

apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/", endPoints);

module.exports = apiRouter;
