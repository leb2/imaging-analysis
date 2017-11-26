const path = require('path');
const config = require('../../../config/config');
const mongoose = require('mongoose');
const SharedPath = require("../../models/shared-path");

module.exports = class Util {
  static get_user_dir(user_id) {
    user_id = user_id.toString();
    return path.join(config.root, 'uploads', user_id);
  }

  static rel_to_full(user_id, rel_path) {
    user_id = user_id.toString();
    return path.join(this.get_user_dir(user_id), rel_path);
  }

  static is_shared(rel_path, user_id, callback) {
    rel_path = path.normalize(rel_path);
    console.log("testing path " + rel_path + " of user_id " + user_id.toString());
    let pathTokens = ["/"].concat(rel_path.split("/"));
    console.log("Tokens:");
    console.log(pathTokens);

    let prefixes = [];
    for (let i = 0; i <= pathTokens.length; i++) {
      let prefix = path.join(...pathTokens.slice(0, i));
      prefixes.push(prefix);
      console.log("Adding search for prefix: " + prefix);
    }

    SharedPath.count({
      user_id: user_id,
      path: {
        $in: prefixes
      }
    }, function(err, count) {
      if (!err && count > 0) {
        console.log("Found entry");
        callback(true);
      } else {
        console.log("Could not find any entries");
        callback(false);
      }
    });
  }
};
