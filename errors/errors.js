const customErrors = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ msg: "404, Not found!" });
  } else {
    next(err);
  }
};

const send404Error = (req, res, next) => {
  res.status(404).send({ msg: "Route not found!" });
};

module.exports = { customErrors, send404Error };
