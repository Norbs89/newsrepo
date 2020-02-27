const {
  changeCommentVote,
  removeCommentbyId
} = require("../models/comments.model");

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

const deleteComment = (req, res, next) => {
  removeCommentbyId(req.params.comment_id)
    .then(message => {
      res.status(202).send(message);
    })
    .catch(err => {
      next(err);
    });
};

module.exports = {
  sendUpdatedComment,
  deleteComment
};
