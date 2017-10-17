const express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

const loggedIn = require('./middleware/logged-in');
const JobSubmission = require('../models/job-submission');


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
