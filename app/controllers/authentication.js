var session = require('express-session');
var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var express = require('express');
var router = express.Router();

var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var config = require('../../config/config');

module.exports = function(app) {
  app.use(session({ secret: config.sessionSecret }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/', router);
};

passport.use(new FacebookStrategy({
  clientID: config.facebookClientId,
  clientSecret: config.facebookClientSecret,
  callbackURL: config.domain + '/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
  User.findOrCreate({
    facebookId: profile.id,
    displayName: profile.displayName
  }, function(err, user) {
    done(err, user);
  });
}));

passport.use(new GoogleStrategy({
  clientID: config.googleClientId,
  clientSecret: config.googleClientSecret,
  callbackURL: config.domain + '/auth/google/callback'
}, function(accessToken, refreshToken, profile, done) {
  User.findOrCreate({
    googleId: profile.id,
    displayName: profile.displayName
  }, function(err, user) {
    return done(err, user);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.get('/login', function(req, res) {
  // req.session.redirect = req.query.from;
  res.render('authentication/login');
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
  }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login'

  }), function(req, res) {
    if (!req.session.redirect) {
      res.redirect('/');
    } else {
      res.redirect(req.session.redirect);
    }
  }
);

router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'

  }), function(req, res) {

    if (!req.session.redirect) {
      res.redirect('/');
    } else {
      res.redirect(req.session.redirect);
    }

  }
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
