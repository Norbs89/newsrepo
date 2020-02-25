const fetchUser = require("../models/users.model");

const getUser = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username).then(user => {
    res.send({ user });
  });
};

module.exports = getUser;
