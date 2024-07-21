const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { songValidationRules, validate } = require('../utilities/song-validator');
const utilities = require('../utilities');
const songsController = require('../controllers/songs');

router.get('/', utilities.handleErrors(songsController.getAll));

router.get('/:id', utilities.handleErrors(songsController.getSingle));

router.post(
  '/',
  verifyToken,
  songValidationRules(),
  validate,
  utilities.handleErrors(async (req, res, next) => {
    await songsController.createSongsRecord(req, res, next);
  })
);

router.put(
  '/:id',
  verifyToken,
  songValidationRules(),
  validate,
  utilities.handleErrors(async (req, res, next) => {
    await songsController.updateSongsRecord(req, res, next);
  })
);

router.delete('/:id', verifyToken, utilities.handleErrors(songsController.deleteSongsRecord));

module.exports = router;
