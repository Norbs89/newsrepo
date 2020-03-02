const connection = require("../db/connection");

const fetchAllTopics = () => {
  return connection("topics")
    .select("*")
    .then(res => {
      return res;
    });
};

const addTopic = topic => {
  return connection
    .insert(topic)
    .into("topics")
    .returning("*")
    .then(postedTopic => {
      return postedTopic[0];
    });
};

module.exports = { fetchAllTopics, addTopic };
