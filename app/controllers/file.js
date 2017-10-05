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
    fileSize: 2000000 // 2 MB
  }
});

module.exports = function(app) {
  app.use('/file', router);
};


// Links uploaded file to file object in database
router.post('/', loggedIn, upload.single('uploadedFile'), function(req, res) {
  const user_dir = path.join(config.root, 'uploads', req.user._id.toString());
  const destination_path = path.join(user_dir, req.file.originalname);
  const source_path = req.file.path;

  cp.execSync('mkdir ' + user_dir);
  fs.renameSync(source_path, destination_path);

  if (req.file.originalname.slice(req.file.originalname.length - 4) == '.zip') {
    cp.execSync('unzip ' + destination_path, {cwd: user_dir});
  }

  res.redirect('home');
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

