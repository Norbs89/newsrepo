const fetchAllTopics = require("../models/topics.model");

const getAllTopics = (req, res, next) => {
  fetchAllTopics().then(topics => {
    res.send({ topics });
  });
};

module.exports = getAllTopics;
