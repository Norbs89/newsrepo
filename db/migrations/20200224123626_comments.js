exports.up = function(knex) {
  console.log("up function is working on COMMENTS");
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable.string("author").references("users.username");
    commentsTable.integer("article_id").references("articles.article_id");
    commentsTable.integer("votes").defaultTo(0);
    commentsTable.timestamp("created_at");
    commentsTable.string("body").notNullable();
  });
};

exports.down = function(knex) {
  console.log("down function is working on COMMENTS");
  return knex.schema.dropTable("comments");
};