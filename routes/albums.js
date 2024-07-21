const express = require('express');
const router = express.Router();
const utilities = require('../utilities');
const { verifyToken } = require('../middleware/authMiddleware');
const { albumValidationRules, validate } = require('../utilities/album-validator');
const albumsController = require('../controllers/albums.js');

router.get('/', utilities.handleErrors(albumsController.getAll));

router.get('/:id', utilities.handleErrors(albumsController.getSingle));

router.post(
  '/',
  verifyToken,
  albumValidationRules(),
  validate,
  utilities.handleErrors(async (req, res, next) => {
    await albumsController.createAlbumRecord(req, res, next);
  })
);

router.put(
  '/:id',
  verifyToken,
  albumValidationRules(),
  validate,
  utilities.handleErrors(async (req, res, next) => {
    await albumsController.updateAlbumRecord(req, res, next);
  })
);

router.delete('/:id', verifyToken, utilities.handleErrors(albumsController.deleteAlbumRecord));

module.exports = router;
