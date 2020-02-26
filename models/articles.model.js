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
      if (commentsAndArticles.length === 0) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      } else {
        commentsAndArticles.forEach(
          obj => (obj.comment_count = commentsAndArticles.length)
        );
        return commentsAndArticles;
      }
    });
};

const patchVotes = (article_id, count) => {
  if (count === undefined) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", count)
    .returning("*")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      } else return article;
    });
};

const addComment = comment => {
  return connection
    .insert(comment)
    .into("comments")
    .returning("*")
    .then(postedComment => {
      return postedComment[0].body;
    });
};

module.exports = { fetchArticleById, patchVotes, addComment };
