const express = require('express');
const router = express.Router();
const utilities = require('../utilities');
const { verifyToken } = require('../middleware/authMiddleware');
const { userValidationRules, validate } = require('../utilities/user-validator');
const userController = require('../controllers/users');

router.get('/', utilities.handleErrors(userController.getAll));
router.get('/:id', utilities.handleErrors(userController.getSingle));

router.post(
  '/',
  verifyToken,
  userValidationRules(),
  validate,
  utilities.handleErrors(async (req, res, next) => {
    await userController.createArtistRecord(req, res, next);
  })
);

router.put(
  '/:id',
  verifyToken,
  userValidationRules(),
  validate,
  utilities.handleErrors(async (req, res, next) => {
    await userController.updateArtistRecord(req, res, next);
  })
);

router.delete('/:id', verifyToken, utilities.handleErrors(userController.deleteArtistRecord));
router.post(
  '/register',
  utilities.handleErrors(async (req, res, next) => {
    await userController.register(req, res, next);
  })
);
router.post(
  '/login',
  utilities.handleErrors(async (req, res, next) => {
    await userController.register(req, res, next);
  })
);

module.exports = router;
