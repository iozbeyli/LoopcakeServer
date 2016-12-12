const mongoose = require('mongoose'),
      BranchPointer = require('./BranchPointer'),
      Feedback = require('./Feedback');

const SubmissionSchema = new mongoose.Schema({
  file: {type:mongoose.SchemaTypes.ObjectId},
  groupID: {type: mongoose.SchemaTypes.ObjectId},
  groupID: {type: mongoose.SchemaTypes.ObjectId}
});

module.exports = mongoose.model('Submission', SubmissionSchema);
