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



// var storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './uploads/files');
//   },
//
//   // Creates a database entry every time a file is uploaded and saves the file
//   // to the filesystem with document id as filename
//   filename: function(req, file, cb) {
//     var fileUpload = new File({ user_id: req.user._id });
//     fileUpload.save();
//     cb(null, fileUpload.id);
//   }
// });

var upload = multer({
  dest: '/tmp/imaging-tools/',
  limits: {
    fileSize: 4000000000 // 4 GB
  }
});

module.exports = function(app) {
  app.use('/file', router);
};

function get_user_dir(user) {
  return path.join(config.root, 'uploads', user._id.toString());
}


// Links uploaded file to file object in database
router.post('/', loggedIn, upload.single('uploadedFile'), function(req, res) {
  const user_dir = get_user_dir(req.user);
  const destination_path = path.join(user_dir, req.file.originalname);
  const source_path = req.file.path;

  cp.execSync('mkdir -p ' + user_dir);
  fs.renameSync(source_path, destination_path);

  if (req.file.originalname.slice(req.file.originalname.length - 4) == '.zip') {
    cp.execSync('unzip ' + destination_path, {cwd: user_dir});
    cp.execSync('rm ' + destination_path);
  }

  res.redirect('home');
});

router.post('/delete', loggedIn, function(req, res) {
  let user_dir = get_user_dir(req.user);
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

// Returns requested file for download
router.get('/download/:id', loggedIn, function(req, res) {
  var outputExt= req.query.output === 'true' ? '_out.csv' : '';
  res.sendFile(path.join(__dirname, '../../uploads/files/') + req.params.id + outputExt);
});

