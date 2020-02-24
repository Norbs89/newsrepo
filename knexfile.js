const ENV = process.env.NODE_ENV || "development";
const { dbDevConfig, dbTestConfig } = require("./dbConfig");

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: dbDevConfig
  },
  test: {
    connection: dbTestConfig
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
