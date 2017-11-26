let mongoose = require('mongoose');

let Schema = mongoose.Schema;
let ObjectId = mongoose.Schema.Types.ObjectId;

let sharedPathSchema = new Schema({
  path: String,
  user_id: ObjectId,
  timestamp: { type : Date, default: Date.now }
});

module.exports = mongoose.model('SharedPath', sharedPathSchema);
