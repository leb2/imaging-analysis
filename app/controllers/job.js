const express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

const loggedIn = require('./middleware/logged-in');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config');
const cp = require('child_process');
const Util = require('./shared/util');
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
  let argPath = Util.rel_to_full(req.user._id, req.body.argPath);
  let scriptPath = Util.rel_to_full(req.user._id, req.body.scriptPath);

  let jobSubmission = new JobSubmission({
    scriptPath: req.body.scriptPath,
    user_id: req.user._id
  });


  jobSubmission.save(function(err, job) {
    // Create and navigate to directory for job to run in
    let jobsDirectory = Util.get_user_dir(req.user._id, 'jobs');
    jobsDirectory = path.join(jobsDirectory, job._id.toString());
    let mkdirCommand = 'mkdir -p ' + jobsDirectory;
    let cdCommand = 'cd ' + jobsDirectory;

    // Copy files to directory
    let cpScriptCommand = 'cp ' + scriptPath + ' ' + jobsDirectory;
    let cpArgCommand = 'cp ' + argPath + ' ' + jobsDirectory;

    let runCommand = './' + path.basename(scriptPath) + ' ' + path.basename(argPath);
    let fullCommand = mkdirCommand + ' && ' + cpScriptCommand + ' && ' + cpArgCommand + ' && ' +  cdCommand + ' && ' + runCommand;
    // console.log(fullCommand);

    cp.exec(fullCommand, function(error, stdout, stderr) {
      if (error) {
        console.log("ERROR occured while trying to run script: ");
        console.log(stdout);
        console.log(stderr);
        next()
      } else {
        console.log("Script ran successfully: " + fullCommand);

        jobSubmission.finished = true;
        jobSubmission.save();
        res.sendStatus(200);
      }
    });
  })
});
