const connection = require("../db/connection");

const fetchArticleById = article_id => {
  return Promise.all([
    checkIfExists("comments", "article_id", article_id),
    article_id
  ])
    .then(([checkIfExists, article_id]) => {
      if (checkIfExists === true) {
        return connection("comments")
          .leftJoin(
            "articles",
            "comments.article_id",
            "=",
            "articles.article_id"
          )
          .where("articles.article_id", article_id)
          .groupBy("articles.article_id")
          .count({ comment_count: "comments.article_id" })
          .select(
            "articles.article_id",
            "articles.author",
            "title",
            "articles.body",
            "topic",
            "articles.created_at",
            "articles.votes"
          );
      } else {
        return connection("articles")
          .where("article_id", article_id)
          .select("*");
      }
    })
    .then(commentsAndArticles => {
      if (commentsAndArticles.length === 0) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      }
      if (!commentsAndArticles[0].hasOwnProperty("comment_count")) {
        commentsAndArticles[0].comment_count = 0;
        return commentsAndArticles[0];
      } else {
        return commentsAndArticles[0];
      }
    });
};

const patchVotes = (article_id, count) => {
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", count.inc_votes || 0)
    .returning("*")
    .then(article => {
      if (Object.entries(count).length === 0) {
        return article[0];
      }
      if (count.inc_votes === undefined) {
        return Promise.reject({ status: 400, msg: "Invalid request" });
      }
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      } else return article[0];
    });
};

const addComment = (comment, article_id) => {
  return Promise.all([
    checkIfExists("articles", "article_id", article_id),
    comment
  ]).then(([checkIfExists, comment]) => {
    if (checkIfExists === false) {
      return Promise.reject({ status: 404, msg: "404, Not found!" });
    } else {
      return connection
        .insert(comment)
        .into("comments")
        .returning("*")
        .then(postedComment => {
          return postedComment[0];
        });
    }
  });
};

const addArticle = article => {
  return connection
    .insert(article)
    .into("articles")
    .returning("*")
    .then(postedArticle => {
      return postedArticle[0];
    });
};

const getCommentsByArticleId = (query, article_id) => {
  return connection("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .where("article_id", article_id)
    .orderBy(query.sort_by || "created_at", query.order || "desc")
    .then(comments => {
      return Promise.all([
        checkIfExists("articles", "article_id", article_id),
        comments
      ]);
    })
    .then(([checkIfExists, comments]) => {
      if (checkIfExists === false) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      } else return comments;
    });
};

const getAllArticles = query => {
  return connection("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id") //leftjoin here?
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
      if (query.hasOwnProperty("topic") || query.hasOwnProperty("author")) {
        return Promise.all([
          checkIfExists("users", "username", query.author),
          checkIfExists("topics", "slug", query.topic),
          articles
        ]);
      } else {
        return [null, null, articles];
      }
    })
    .then(([checkIfExists, checkIfExists2, articles]) => {
      if (checkIfExists === false || checkIfExists2 === false) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      } else {
        return articles;
      }
    });
};

const removeArticlebyId = article_id => {
  return connection("articles")
    .where("article_id", article_id)
    .del()
    .then(body => {
      if (body === 0) {
        return Promise.reject({ status: 404, msg: "404, Not found!" });
      }
    });
};

const checkIfExists = (table, column, value) => {
  if (value === undefined) {
    return true;
  }
  return connection(table)
    .where(`${column}`, value)
    .then(result => {
      if (result.length !== 0) {
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
  getAllArticles,
  addArticle,
  removeArticlebyId
};
