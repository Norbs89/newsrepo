const connection = require("../db/connection");

const fetchAllTopics = () => {
  return connection("topics")
    .select("*")
    .then(res => {
      return res;
    });
};

module.exports = fetchAllTopics;
