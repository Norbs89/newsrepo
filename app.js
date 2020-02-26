const express = require("express");
const apiRouter = require("./routers/api.router.js");
const { customErrors, send404Error } = require("./errors/errors");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(customErrors);

app.use("/*", send404Error);

module.exports = app;
