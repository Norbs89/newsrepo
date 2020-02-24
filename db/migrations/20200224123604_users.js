exports.up = function(knex) {
  console.log("up function is working on USERS");
  return knex.schema.createTable("users", usersTable => {
    usersTable.string("username").primary();
    usersTable.string("avatar_url").notNullable();
    usersTable.string("name").notNullable();
  });
};

exports.down = function(knex) {
  console.log("down function is working on USERS");
  return knex.schema.dropTable("users");
};
