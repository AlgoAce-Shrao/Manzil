const { validationResult } = require('express-validator');

module.exports = function (req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  // format errors
  const extracted = [];
  errors.array().map(err => extracted.push({ field: err.param, msg: err.msg }));

  return res.status(422).json({
    message: 'Validation failed',
    errors: extracted
  });
};
