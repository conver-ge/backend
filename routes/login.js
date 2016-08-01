/**
 * Created by kiprasad on 01/08/16.
 */
var express = require('express');
var userDB = require('../db/user');
var bcrypt = require('bcrypt');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    userDB.getUserWithPassword(username, password, function(err, result) {
      if (err) {
        done(err);
      } else {
        if (result) {
          done(null, result);
        } else {
          return done(null, false, {message: 'Incorrect username or password.'});
        }
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send('Incorrect username or password.');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(user));
    });
  })(req, res, next);
});

module.exports = router;
