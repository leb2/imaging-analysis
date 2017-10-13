var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

const loggedIn = require('./middleware/logged-in');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config');
const cp = require('child_process');
const listfiles = require('./shared/listfiles');
const util = require('./shared/util');


module.exports = function (app) {
  // Makes sure user data accessible in all templates
  // This should be called first, currently undefined behaviour
  app.use(function(req, res, next) {
    if (req.user) {
      req.app.locals.user = req.user;
    } else {
      req.app.locals.user = null;
    }
    next();
  });
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/home', loggedIn, function (req, res, next) {
  let rel_path = req.query.path == undefined ? "" : req.query.path;
  const back = req.query.back != undefined;
  listfiles(req.user, rel_path, back, function(results) {
    res.render('home', results);
  })
});
