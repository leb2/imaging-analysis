var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

const loggedIn = require('./middleware/logged-in');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config');
const cp = require('child_process');


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
  const rel_path = req.query.path == undefined ? "" : req.query.path;

  const user_id = req.user._id.toString();
  const user_dir = path.join(config.root, 'uploads', user_id, rel_path);

  fs.readdir(user_dir, function(err, items) {
    if (items == undefined) {
      res.render('home', {files: []});
    } else {
      files = [];
      for (let i = 0; i < items.length; i++) {
        let filepath = path.join(user_dir, items[i]);
        let isDirectory = fs.statSync(filepath).isDirectory();
        files.push({
          name: items[i],
          isDirectory: isDirectory
        })
      }
      res.render('home', {files: files});
    }
  });
});
