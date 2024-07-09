const express = require('express');
const router = express.Router();
const utilities = require('../utilities');

const userController = require('../controllers/users');

router.get('/', utilities.handleErrors(userController.getAll));

module.exports = router;
