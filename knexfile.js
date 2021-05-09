const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";
const { dbDevConfig, dbTestConfig } = require("./dbConfig");

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};

const customConfig = {
  development: {
    connection: dbDevConfig,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  test: {
    connection: dbTestConfig,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  production: {
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};

module.exports = { ...customConfig[ENV], ...baseConfig };
