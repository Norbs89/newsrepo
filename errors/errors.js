const pSQLErrors = (err, req, res, next) => {
  const errorCodes = {
    42703: { status: 400, msg: "Invalid query" },
    "22P02": {
      status: 400,
      msg: "Invalid request"
    },
    23502: { status: 400, msg: "Value is missing or invalid data type" },
    23503: { status: 400, msg: "Value is missing or invalid data type" }
  };
  if (err.code) {
    res
      .status(errorCodes[err.code].status)
      .send({ msg: errorCodes[err.code].msg });
  } else {
    next(err);
  }
};

const customErrors = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: "404, Not found!" });
  }
  if (err.status === 400) {
    res.status(400).send({ msg: "Invalid request" });
  } else {
    next(err);
  }
};

const send404Error = (req, res, next) => {
  res.status(404).send({ msg: "Route not found!" });
};

const send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed!" });
};

module.exports = { customErrors, send404Error, send405Error, pSQLErrors };
