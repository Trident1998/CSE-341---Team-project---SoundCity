const express = require('express');
const router = express.Router();
const utilities = require('../utilities');

const songsController = require('../controllers/songs');

router.get('/', utilities.handleErrors(songsController.getAll));

module.exports = router;
