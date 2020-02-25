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

// knex("users")
//   .join("contacts", "users.id", "=", "contacts.user_id")
//   .select("users.id", "contacts.phone");

module.exports = fetchArticleById;
