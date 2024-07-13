const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

router.use('/', require('./swagger'));
router.use('/books', require('./books'));
router.use('/users', require('./users'));
router.use('/artists', require('./artists'));
router.use('/albums', require('./albums'));
router.use('/songs', require('./songs'));
router.use('/playlists', require('./playlists'));

router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed' });
});

module.exports = router;
