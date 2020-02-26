const topicsRouter = require("express").Router();
const getAllTopics = require("../controllers/topics.controller");
const { send405Error } = require("../errors/errors");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .all(send405Error);

module.exports = topicsRouter;
