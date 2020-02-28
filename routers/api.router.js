const apiRouter = require("express").Router();

const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");
const { send405Error, send404Error } = require("../errors/errors");
const sendEndPoints = require("../controllers/api.controller");

apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/", sendEndPoints);
apiRouter.use("/*", send404Error);
apiRouter.all(send405Error);

module.exports = apiRouter;
