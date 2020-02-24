exports.up = function(knex) {
  console.log("up function is working on TOPICS");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable.string("slug").primary();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  console.log("down function is working on TOPICS");
  return knex.schema.dropTable("topics");
};