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
const SharedPath = require('../models/shared-path');


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

/**
 * Route to share a path, making it visible to the public
 */
router.post('/share', loggedIn, function(req, res, next) {
  let sharedPath = new SharedPath({
    path: path.normalize(req.body.path),
    user_id: req.user._id
  });

  sharedPath.save(function(err) {
    if (err) {
      return next();
    }
    return res.sendStatus(200);
  })
});

router.get('/view', loggedIn, function(req, res) {
  res.redirect('view/' + req.user._id.toString());
});

router.get('/view/:user_id', function(req, res, next) {
  let rel_path = req.query.path == undefined ? "" : req.query.path;
  const back = req.query.back != undefined;

  let user_id = req.params.user_id;
  console.log("This is teh user: ");
  console.log(req.user);
  let isViewing = req.user == undefined || user_id != req.user._id;
  console.log("This is the viewing status " + isViewing);

  listfiles(user_id, rel_path, back, isViewing, function(results) {
    if (!results) {
      results = {cannotAccess: true};
    }
    results['viewing'] = isViewing;
    results['viewingId'] = user_id;
    res.render('home', results);
  });
});

// router.get('/home', loggedIn, function (req, res, next) {
//   let rel_path = req.query.path == undefined ? "" : req.query.path;
//   const back = req.query.back != undefined;
//   listfiles(req.user._id, rel_path, back, function(results) {
//     res.render('home', results);
//   })
// });
