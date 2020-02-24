const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

const formattedArticles = formatDates(articleData);

exports.seed = function(knex) {
  const topicsInsertions = knex("topics")
    .insert(topicData)
    .returning("*");
  const usersInsertions = knex("users")
    .insert(userData)
    .returning("*");

  const articleInsertions = knex("articles")
    .insert(formattedArticles)
    .returning("*");

  return Promise.all([
    topicsInsertions,
    usersInsertions,
    articleInsertions
  ]).then(([topicRows, userRows, articleRows]) => {
    const articleRef = makeRefObj(articleRows);
    const formattedComments = formatComments(commentData, articleRef);
    return knex("comments").insert(formattedComments);
  });
};
