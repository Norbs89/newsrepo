const topicsRouter = require("express").Router();
const {
  getAllTopics,
  postNewTopic
} = require("../controllers/topics.controller");
const { send405Error } = require("../errors/errors");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .post(postNewTopic)
  .all(send405Error);

module.exports = topicsRouter;
