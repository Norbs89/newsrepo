const connection = require("../db/connection");

const changeCommentVote = (votes, comment_id) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .increment("votes", votes)
    .returning("*")
    .then(comment => {
      console.log(comment);
      if (comment.length === 0) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      } else return comment;
    });
};

module.exports = changeCommentVote;
