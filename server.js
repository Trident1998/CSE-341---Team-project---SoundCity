const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const createError = require('http-errors');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;

const port = process.env.PORT || 8080;
const app = express();

app
  .use(bodyParser.json())
  .use(
    session({
      secret: 'seecret',
      resave: false,
      saveUninitialized: true
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    console.log('CORS headers middleware');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, OPTIONS, DELETE');
    next();
  })
  .use('/', require('./routes'));

app.get('/', (req, res) => {
  console.log('GET /');
  res.send(
    req.session.user !== undefined ? `Logged in as ${req.session.user.username}` : 'Logged Out'
  );
});

app.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// Handle 404 errors
app.use((req, res, next) => {
  next(createError(404, 'Not found'));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });

  next();
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
      //User.findOrCreate({ githubId: profile.id } function (err, user) {
      return done(null, profile);
      //);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on ${port}`);
    });
  }
});
