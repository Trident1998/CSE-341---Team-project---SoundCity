const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/books', require('./books'));
router.use('/users', require('./users'));
router.use('/artists', require('./artists'));
router.use('/albums', require('./albums'));
router.use('/songs', require('./songs'));
router.use('/playlists', require('./playlists'));

router.get('/login', passport.authenticate('github'));
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
