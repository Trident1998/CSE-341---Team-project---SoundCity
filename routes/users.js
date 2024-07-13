const express = require('express');
const router = express.Router();
const utilities = require('../utilities');

const userController = require('../controllers/users');

router.get('/', utilities.handleErrors(userController.getAll));
router.post('/register', utilities.handleErrors(userController.register));
router.post('/login', utilities.handleErrors(userController.login));

module.exports = router;
