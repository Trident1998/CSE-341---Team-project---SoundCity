const { body, validationResult } = require('express-validator');
const artistValidator = {};

artistValidator.artistValidationRules = () => {
  return [
    body('name')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('Please provide a name'),

    body('bio').isString().trim().escape().notEmpty().withMessage('Please provide a bio'),

    body('genre').isString().trim().escape().notEmpty().withMessage('Please provide a genre')
  ];
};

artistValidator.validate = (req, res, next) => {
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

module.exports = artistValidator;
