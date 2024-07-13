const express = require('express');
const router = express.Router();
const utilities = require('../utilities');
const { verifyToken } = require('../middleware/authMiddleware');
const artistsController = require('../controllers/artists');
const { artistValidationRules, validate } = require('../utilities/artist-validator');

router.get('/', utilities.handleErrors(artistsController.getAll));

router.get('/:id', utilities.handleErrors(artistsController.getSingle));

router.post(
  '/',
  verifyToken,
  artistValidationRules(),
  validate,
  utilities.handleErrors(async (req, res, next) => {
    artistsController.createArtistRecord(req, res, next);
  })
);

router.put(
  '/:id',
  verifyToken,
  artistValidationRules(),
  validate,
  utilities.handleErrors(async (req, res, next) => {
    await artistsController.updateArtistRecord(req, res, next);
  })
);

router.delete('/:id', verifyToken, utilities.handleErrors(artistsController.deleteArtistRecord));

module.exports = router;
