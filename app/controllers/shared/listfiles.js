const util = require('./util');
const fs = require('fs');
const path = require('path');


module.exports = function(user, rel_path, back, callback) {
  console.log("raw path " + rel_path);
  if (back) {
    rel_path = rel_path.substr(0, rel_path.lastIndexOf("/"));
  }
  console.log("Value of back: " + back);
  console.log("Rel path: " + rel_path);




  let user_dir = util.rel_to_full(user, rel_path);

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
        files.push({
          name: items[i],
          isDirectory: isDirectory
        })
      }

      callback({
        files: files,
        path: rel_path
      });
    }
  });
};
