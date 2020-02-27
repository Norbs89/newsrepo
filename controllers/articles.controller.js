const {
  fetchArticleById,
  patchVotes,
  addComment,
  getCommentsByArticleId,
  getAllArticles
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
  const comment = {
    author: req.body.username,
    body: req.body.body,
    article_id: req.params.article_id
  };
  addComment(comment)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

const sendCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const query = req.query;
  getCommentsByArticleId(query, article_id)
    .then(comments => {
      res.send({ comments });
    })
    .catch(err => {
      next(err);
    });
};

const sendAllArticles = (req, res, next) => {
  const query = req.query;
  getAllArticles(query)
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = {
  getArticleById,
  changeVotes,
  postComment,
  sendCommentsByArticleId,
  sendAllArticles
};
