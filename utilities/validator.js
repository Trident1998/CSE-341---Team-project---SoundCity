const { body, validationResult } = require('express-validator');
const bookValidator = {};

bookValidator.bookValidationRules = () => {
  return [
    body('title')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('Please provide a title'),

    body('author')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('Please provide an author'),

    body('publishedDate')
      .isDate({ format: 'YYYY-MM-DD' })
      .withMessage('Please provide a published date with format YYYY-MM-DD'),

    body('genre')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('Please provide a genre'),

    body('country')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a country')
  ];
};

bookValidator.validate = (req, res, next) => {
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

module.exports = bookValidator;
