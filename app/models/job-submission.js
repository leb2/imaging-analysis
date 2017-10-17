const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const jobSubmissionSchema = new Schema({
  finished: {type: Boolean, default: false},
  scriptPath: String,

  // Created automatically
  user_id: ObjectId,
  timestamp: { type : Date, default: Date.now }
});

module.exports = mongoose.model('JobSubmission', jobSubmissionSchema);
