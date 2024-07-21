const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { playlistValidationRules, validate } = require('../utilities/playlist-validator');
const utilities = require('../utilities');

const playlistsController = require('../controllers/playlists');

router.get('/', utilities.handleErrors(playlistsController.getAll));

router.get('/:id', utilities.handleErrors(playlistsController.getSingle));

router.post(
  '/',
  verifyToken,
  playlistValidationRules(),
  validate,
  utilities.handleErrors(async (req, res, next) => {
    await playlistsController.createSongsRecord(req, res, next);
  })
);

router.put(
  '/:id',
  verifyToken,
  playlistValidationRules(),
  validate,
  utilities.handleErrors(async (req, res, next) => {
    await playlistsController.updateSongsRecord(req, res, next);
  })
);

router.delete('/:id', verifyToken, utilities.handleErrors(playlistsController.deleteSongsRecord));

module.exports = router;
