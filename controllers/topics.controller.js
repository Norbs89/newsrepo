const { fetchAllTopics, addTopic } = require("../models/topics.model");

const getAllTopics = (req, res, next) => {
  fetchAllTopics().then(topics => {
    res.send({ topics });
  });
};

const postNewTopic = (req, res, next) => {
  addTopic(req.body)
    .then(topic => {
      res.status(201).send({ topic });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = { getAllTopics, postNewTopic };
