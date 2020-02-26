const connection = require("../db/connection");

const fetchUser = username => {
  return connection("users")
    .where("username", username)
    .returning("*")
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      } else {
        return user;
      }
    });
};

module.exports = fetchUser;
