const connection = require("../db/connection");

const fetchArticleById = article_id => {
  return connection("comments")
    .join("articles", "comments.article_id", "=", "articles.article_id")
    .where("articles.article_id", article_id)
    .select(
      "articles.article_id",
      "articles.author",
      "title",
      "articles.body",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .then(commentsAndArticles => {
      commentsAndArticles.forEach(
        obj => (obj.comment_count = commentsAndArticles.length)
      );
      return commentsAndArticles;
    });
};

const patchVotes = (article_id, count) => {
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", count)
    .returning("*")
    .then(article => {
      return article;
    });
};

module.exports = { fetchArticleById, patchVotes };
