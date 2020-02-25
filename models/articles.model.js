const connection = require("../db/connection");

const fetchArticleById = article_id => {
  console.log(article_id);
  return connection("comments")
    .returning("*")
    .then(mystery => {
      console.log(mystery);
    });
};

module.exports = fetchArticleById;
