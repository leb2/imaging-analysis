const User = require('../../models/user');


module.exports = function(req, res, next) {
  if (req.user) {
    next();
  } else {

    // TODO: Temp for debugging purposes only
    User.findById("59d3d46423b3cb3898c10f5e", function(err, result) {
      req.user = result;
      next()
    });
    // res.redirect('/login?from=' + req.path);
  }
};
