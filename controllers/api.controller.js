const endpoints = require("../endpoints.json");

const sendEndPoints = (req, res) => {
  res.send(endpoints);
};

module.exports = sendEndPoints;
