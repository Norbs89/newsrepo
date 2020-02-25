const connection = require("../db/connection");

const fetchUser = username => {
  return connection("users")
    .where("username", username)
    .returning("*")
    .then(user => {
      return user;
    });
};

module.exports = fetchUser;
