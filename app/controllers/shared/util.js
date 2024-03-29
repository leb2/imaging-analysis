const path = require('path');
const config = require('../../../config/config');
const mongoose = require('mongoose');
const SharedPath = require("../../models/shared-path");

module.exports = class Util {
  /**
   * Get the directory where the files are stored for a user
   * @param user_id: Id of user
   * @param prefix: The name of the base directory
   * @returns {string|*} The full path to directory
   */
  static get_user_dir(user_id, prefix) {
    if (prefix == undefined) {
      prefix = 'uploads';
    }
    user_id = user_id.toString();
    return path.join(config.root, prefix, user_id);
  }

  static rel_to_full(user_id, rel_path, prefix) {
    user_id = user_id.toString();
    return path.join(this.get_user_dir(user_id, prefix), rel_path);
  }

  static is_shared(rel_path, user_id, callback) {
    rel_path = path.normalize(rel_path);
    let pathTokens = ["/"].concat(rel_path.split("/"));

    let prefixes = [];
    for (let i = 0; i <= pathTokens.length; i++) {
      let prefix = path.join(...pathTokens.slice(0, i));
      prefixes.push(prefix);
    }

    SharedPath.count({
      user_id: user_id,
      path: {
        $in: prefixes
      }
    }, function(err, count) {
      if (!err && count > 0) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }
};
