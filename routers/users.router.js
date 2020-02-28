const usersRouter = require("express").Router();
const getUser = require("../controllers/users.controller");
const { send405Error, send404Error } = require("../errors/errors");

usersRouter
  .route("/:username")
  .get(getUser)
  .all(send405Error);

module.exports = usersRouter;
