const parseIntMiddleware = (req, res, next) => {
  ["page", "size"].forEach((param) => {
    if (req.query[param]) req.query[param] = parseInt(req.query[param], 10);
  });

  ["id", "teacherId"].forEach((param) => {
    if (req.params[param]) req.params[param] = parseInt(req.params[param], 10);
  });

  next();
};

module.exports = {
  parseIntMiddleware,
};
