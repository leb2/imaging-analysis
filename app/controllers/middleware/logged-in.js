const User = require('../../models/user');
const config = require('../../../config/config');

env = process.env.NODE_ENV || 'development';

module.exports = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    if (true || env == 'development') {
      // TODO: Temp for debugging purposes only
      User.findById("59d3d46423b3cb3898c10f5e", function(err, result) {
        req.user = result;
        console.log(err);
        console.log(result);
        next()
      });
    } else {
      res.redirect('/login?from=' + req.path);
    }
  }
};
