var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var userSchema = new Schema({
    facebookId: String,
    googleId: String,
    displayName: String
});

// userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
