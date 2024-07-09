const express = require('express');
const router = express.Router();
const utilities = require('../utilities');

const playlistsController = require('../controllers/playlists');

router.get('/', utilities.handleErrors(playlistsController.getAll));

module.exports = router;
