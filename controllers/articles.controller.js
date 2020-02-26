const { fetchArticleById, patchVotes } = require("../models/articles.model");

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

module.exports = { getArticleById, changeVotes };
