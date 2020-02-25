const fetchArticleById = require("../models/articles.model");

const getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;

  fetchArticleById(article_id).then(article => {
    // console.log(article);
  });
};

module.exports = getArticleById;
