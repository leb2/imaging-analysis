const util = require('./util');
const fs = require('fs');
const path = require('path');
const Util  = require('../shared/util');
const cp = require('child_process');



module.exports = function(user_id, rel_path, back, isViewing, callback) {
  user_id = user_id.toString();
  if (back) {
    rel_path = rel_path.substr(0, rel_path.lastIndexOf("/"));
  }

  // listfiles will return false if file is not viewable
  Util.is_shared(rel_path, user_id, function(isShared) {
    if (isViewing && !isShared) {
      callback(false);

    } else {
      let user_dir = util.rel_to_full(user_id, rel_path);

      fs.readdir(user_dir, function(err, items) {
        if (items == undefined) {
          callback({
            files: [], path: ''
          });
        } else {
          files = [];

          for (let i = 0; i < items.length; i++) {
            let filepath = path.join(user_dir, items[i]);
            let isDirectory = fs.statSync(filepath).isDirectory();
            let hash = "";

            // let hashScript = "find " + filepath + " -type f -print0 | sort -z | xargs -0 shasum | shasum";
            if (!isDirectory) {
              hashScript = "shasum " + filepath;
              hash = cp.execSync(hashScript).toString('utf8');
              // hash = hash.substr(0, hash.indexOf(' '));
              hash = hash.substr(0, 10);
            }

            console.log(hash);
            files.push({
              name: items[i],
              hash: hash,
              isDirectory: isDirectory
            })
          }

          callback({
            files: files,
            path: rel_path
          });
        }
      });
    }
  });
};
