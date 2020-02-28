const connection = require("../db/connection");

const changeCommentVote = (votes, comment_id) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .increment("votes", votes.inc_votes || 0)
    .returning("*")
    .then(comment => {
      if (Object.entries(votes).length === 0) {
        return comment[0];
      }
      if (votes.inc_votes === undefined) {
        return Promise.reject({ status: 400, msg: "Invalid request" });
      }
      if (comment.length === 0) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      } else return comment[0];
    });
};

const removeCommentbyId = comment_id => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del()
    .then(body => {
      if (body === 0) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      }
    });
};

module.exports = { changeCommentVote, removeCommentbyId };
