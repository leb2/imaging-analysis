const path = require('path');
const config = require('../../../config/config');

module.exports = class Util {
  static get_user_dir(user_id) {
    user_id = user_id.toString();
    return path.join(config.root, 'uploads', user_id);
  }

  static rel_to_full(user_id, rel_path) {
    user_id = user_id.toString();
    return path.join(this.get_user_dir(user_id), rel_path);
  }

  static is_shared(path, user_id) {
    return true;
  }
};
