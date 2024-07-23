const { body, validationResult } = require('express-validator');
const albumValidator = {};

albumValidator.albumValidationRules = () => {
  return [
    body('title')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a title'),

    body('release_date')
      .exists()
      .trim()
      .escape()
      .notEmpty()
      .isDate({ format: 'yyyy-mm-dd' })
      .withMessage('Please provide a release_date'),

    body('id').isString().trim().escape().notEmpty().withMessage('Please provide an artist id'),

    body('name')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('Please provide an artist name')
  ];
};

albumValidator.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  console.log(errors);
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors
  });
};

module.exports = albumValidator;
