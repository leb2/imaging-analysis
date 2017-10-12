const path = require('path');
const config = require('../../../config/config');

module.exports = class Util {
  static get_user_dir(user) {
    return path.join(config.root, 'uploads', user._id.toString());
  }

  static rel_to_full(user, rel_path) {
    return path.join(this.get_user_dir(user), rel_path);
  }
};
