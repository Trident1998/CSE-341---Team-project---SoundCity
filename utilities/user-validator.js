const { body, validationResult } = require('express-validator');
const artistValidator = {};

artistValidator.userValidationRules = () => {
  return [
    body('firstname')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('Please provide a firstname'),

    body('lastname')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('Please provide a lastname'),

    body('age').isInt({ min: 0, max: 99 }).withMessage('Please provide an age'),

    body('email').isEmail().trim().escape().notEmpty().withMessage('Please provide an email'),

    body('password').isString().trim().escape().notEmpty().withMessage('Please provide a password'),

    body('bio').isString().trim().escape().notEmpty().withMessage('Please provide a bio'),

    body('avatar')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide an avatar link')
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
