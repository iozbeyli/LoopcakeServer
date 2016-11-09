const mongoose = require('mongoose'),
      BranchPointer = require('./BranchPointer'),
      Feedback = require('./Feedback');

const SubmissionSchema = new mongoose.Schema({
  branchPointer: {type:mongoose.SchemaTypes.ObjectId, ref: 'BranchPointer'},
  feedback: {type: mongoose.SchemaTypes.ObjectId, ref: 'Feedback'}
});

module.exports = mongoose.model('Submission', SubmissionSchema);
