const express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

const loggedIn = require('./middleware/logged-in');
const JobSubmission = require('../models/job-submission');
const listfiles = require('./shared/listfiles');


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
  app.use('/current-jobs', router);
};

router.get('/', loggedIn, function(req, res) {
  let user_id = mongoose.Types.ObjectId(req.user._id);
  JobSubmission.find({user_id: user_id}).sort('-timestamp')
    .exec(function(err, jobs) {
      res.render('current-jobs', {jobs: jobs});
    });
});

router.get('/view/:id', loggedIn, function(req, res) {
  let rel_path = req.body.path == undefined ? "" : req.body.path;
  const back = req.body.back == undefined ? "" : JSON.parse(req.body.back);

  let user_id = mongoose.Types.ObjectId(req.user._id);

  console.log(req.params.id);
  console.log(user_id);

  JobSubmission.findOne({_id: req.params.id, user_id: user_id}, function(err, job) {
    console.log(job);

    listfiles(user_id, rel_path, back, false, function(results) {
      if (!results) {
        results = {cannotAccess: true};
      }
      results['viewing'] = false;
      results['viewingId'] = user_id;

      res.render('home', results);
    }, 'jobs/', job._id.toString());
  });
});
