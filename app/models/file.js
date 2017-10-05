var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var fileSchema = new Schema({
  user_id: ObjectId,
  name: String,
  timestamp: { type : Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
