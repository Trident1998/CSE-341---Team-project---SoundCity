const { body, validationResult } = require('express-validator');
const playlistValidator = {};

playlistValidator.playlistValidationRules = () => {
  return [
    body('title')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a title'),

    body('description')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a description'),

    body('user_id').isString().trim().escape().notEmpty().withMessage('Please provide an user id'),

    body('songs').isArray().withMessage('Songs should be an array'),

    body('songs.*.id')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide an song id'),

    body('songs.*.title')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide an song title')
  ];
};

playlistValidator.validate = (req, res, next) => {
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

module.exports = playlistValidator;
