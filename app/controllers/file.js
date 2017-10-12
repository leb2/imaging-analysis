'use strict';

var express = require("express");
var router = express.Router();
var multer = require('multer');
var fs = require("fs");
var path = require("path");

var loggedIn = require('./middleware/logged-in');
var File = require("../models/file");
const cp = require('child_process');
const config = require('../../config/config');
const util  = require('./shared/util');

var upload = multer({
  dest: '/tmp/imaging-tools/',
  limits: {
    fileSize: 4000000000 // 4 GB
  }
});

module.exports = function(app) {
  app.use('/file', router);
};


// Links uploaded file to file object in database
router.post('/', loggedIn, upload.single('uploadedFile'), function(req, res) {
  const user_dir = util.get_user_dir(req.user);
  const destination_path = path.join(user_dir, req.file.originalname);
  const source_path = req.file.path;

  // TODO: Encapsulate all of this in a single bash script
  cp.execSync('mkdir -p ' + user_dir);
  fs.renameSync(source_path, destination_path);

  if (req.file.originalname.slice(req.file.originalname.length - 4) == '.zip') {
    cp.execSync('unzip -o' + destination_path, {cwd: user_dir});
    cp.execSync('rm ' + destination_path);
  }

  cp.execSync('chmod -R 755 ' + user_dir);
  res.redirect('home');
});

router.post('/delete', loggedIn, function(req, res) {
  let user_dir = util.get_user_dir(req.user);
  let rel_path = req.body.path;
  let file = req.body.file;
  let full_path = path.join(user_dir, rel_path, file);

  // TODO: Make this actual remove
  cp.execSync('mv ' + full_path + ' /Users/Brendan/.Trash');
  res.sendStatus(200);
});

router.get('/download/:id', loggedIn, function(req, res) {
  const file = path.join(__dirname, '../../uploads/files', req.params.id);
  res.download(file);
});

router.get('/view', loggedIn, function(req, res) {
  let user_dir = util.get_user_dir(req.user);
  let rel_path = req.query.path;
  let full_path = path.join(user_dir, rel_path);

  if (rel_path.endsWith(".nii") || rel_path.endsWith('.nii.gz')) {
    res.render('fileviews/nii', {path: rel_path});
  } else {
    res.sendfile(full_path);
  }
});

router.get('/data', loggedIn, function(req, res) {
  let user_dir = util.get_user_dir(req.user);
  let rel_path = req.query.path;
  let full_path = path.join(user_dir, rel_path);

  res.sendFile(full_path);
});

/*
http://localhost:3000/file/view?path=/ds001_R2.0.4/sub-01/func/sub-01_task-balloonanalogrisktask_run-01_bold.nii.gz
*/


// Returns requested file for download
// router.get('/download/:id', loggedIn, function(req, res) {
//   var outputExt= req.query.output === 'true' ? '_out.csv' : '';
//   res.sendFile(path.join(__dirname, '../../uploads/files/') + req.params.id + outputExt);
// });

