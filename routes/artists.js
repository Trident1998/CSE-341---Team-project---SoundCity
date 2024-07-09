const express = require('express');
const router = express.Router();
const utilities = require('../utilities');

const artistsController = require('../controllers/artists');

router.get('/', utilities.handleErrors(artistsController.getAll));

module.exports = router;
