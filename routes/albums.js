const express = require('express');
const router = express.Router();
const utilities = require('../utilities');

const albumsController = require('../controllers/albums.js');

router.get('/', utilities.handleErrors(albumsController.getAll));

module.exports = router;
