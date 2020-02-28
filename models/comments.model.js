const connection = require("../db/connection");

const changeCommentVote = (votes, comment_id) => {
  if (votes === undefined) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  } else {
    return connection("comments")
      .where("comment_id", comment_id)
      .increment("votes", votes || 0)
      .returning("*")
      .then(comment => {
        if (comment.length === 0) {
          return Promise.reject({ status: 404, msg: "404, Not found!" });
        } else return comment;
      });
  }
};

const removeCommentbyId = comment_id => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(body => {
      if (body === 0) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      }
      return { msg: "Delete request successful" };
    });
};

module.exports = { changeCommentVote, removeCommentbyId };
