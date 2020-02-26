const {
  fetchArticleById,
  patchVotes,
  addComment
} = require("../models/articles.model");

const getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleById(article_id)
    .then(article => {
      res.send({ article });
    })
    .catch(err => {
      next(err);
    });
};

const changeVotes = (req, res, next) => {
  const article_id = req.params.article_id;
  const count = req.body.inc_votes;
  patchVotes(article_id, count)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  const article_id = req.params.article_id;
  const author = req.body.username;
  const comment = {
    author: author,
    body: req.body.body,
    article_id: article_id
  };
  addComment(comment).then(comment => {
    res.status(201).send({ comment });
  });
};

module.exports = { getArticleById, changeVotes, postComment };
