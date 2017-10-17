const express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

const loggedIn = require('./middleware/logged-in');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config');
const cp = require('child_process');
const util = require('./shared/util');
const JobSubmission = require('../models/job-submission');


module.exports = function (app) {
  app.use(function(req, res, next) {
    if (req.user) {
      req.app.locals.user = req.user;
    } else {
      req.app.locals.user = null;
    }
    next();
  });
  app.use('/job', router);
};

router.get('/', loggedIn, function (req, res, next) {
  res.render('submit-job');
});

router.post('/run', loggedIn, function(req, res, next) {
  let scriptPath = req.body.scriptPath;
  let argPath = req.body.argPath;

  console.log("Command: ");
  console.log(scriptPath + ' ' + argPath);

  let cdCommand = 'cd ' + util.get_user_dir(req.user);
  let scriptCommand = scriptPath + ' ' + argPath;
  let fullCommand = cdCommand + ' && ./' + scriptCommand;

  let jobSubmission = new JobSubmission({
    scriptPath: scriptPath,
    user_id: req.user._id
  });

  jobSubmission.save(function() {
    cp.exec(fullCommand, function() {
      console.log("Script ran successfully: " + fullCommand);

      jobSubmission.finished = true;
      jobSubmission.save();
    });
    res.status(200);
  })
});
