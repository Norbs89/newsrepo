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

const getCommentsByArticleId = (query, article_id) => {
  return connection("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .where("article_id", article_id)
    .orderBy(query.sort_by || "created_at", query.order || "desc")
    .then(comments => {
      return Promise.all([checkIfExists(article_id), comments]);
    })
    .then(([checkIfExists, comments]) => {
      if (checkIfExists === false) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      } else return comments;
    });
};

const getAllArticles = query => {
  return connection("articles")
    .join("comments", "comments.article_id", "=", "articles.article_id")
    .groupBy("articles.article_id")
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .count({ comment_count: "comments.article_id" })
    .orderBy(query.sort_by || "created_at", query.order || "desc")
    .modify(querySoFar => {
      if (query.hasOwnProperty("author")) {
        querySoFar.where("articles.author", query.author);
      }
    })
    .modify(querySoFar => {
      if (query.hasOwnProperty("topic")) {
        querySoFar.where("articles.topic", query.topic);
      }
    })
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      }
      return articles;
    });
};

const checkIfExists = article_id => {
  return connection("articles")
    .where("article_id", article_id)
    .then(article => {
      if (article.length !== 0) {
        return true;
      } else {
        return false;
      }
    });
};

module.exports = {
  fetchArticleById,
  patchVotes,
  addComment,
  getCommentsByArticleId,
  getAllArticles
};
