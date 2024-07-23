const { body, validationResult } = require('express-validator');
const songValidator = {};

songValidator.songValidationRules = () => {
  return [
    body('title')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a title'),

    body('duration')
      .exists()
      .trim()
      .escape()
      .notEmpty()
      .isTime({ mode: 'withSeconds' })
      .withMessage('Please provide a duration'),

    body('genre').isString().trim().escape().notEmpty().withMessage('Please provide a genre'),

    body('artist_id')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide an artist id'),

    body('artist_name')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage('Please provide an artist name'),

    body('album_id')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Please provide an album id'),

    body('album_name')
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide an album name')
  ];
};

songValidator.validate = (req, res, next) => {
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

module.exports = songValidator;
