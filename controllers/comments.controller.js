const changeCommentVote = require("../models/comments.model");

const sendUpdatedComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  const votes = req.body.inc_votes;
  changeCommentVote(votes, comment_id)
    .then(comment => {
      res.send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = sendUpdatedComment;
