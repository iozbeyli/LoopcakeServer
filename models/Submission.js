const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Feedback = require('./Feedback');

const sAttachmentSchema = new Schema({
    attachmentid: {type:mongoose.SchemaTypes.ObjectId},
    filename: {type: String}
})
const SubmissionSchema = new mongoose.Schema({
  report: {type: mongoose.SchemaTypes.ObjectId},
  attachment: [sAttachmentSchema],
  commitID: {type: String},
  details: {type: String},
  groupID: {type: mongoose.SchemaTypes.ObjectId},
  groupName: {type: String},
  projectID: {type: mongoose.SchemaTypes.ObjectId},
  date: { type: Date, default: Date.now },
  feedback: {type: mongoose.SchemaTypes.ObjectId}
});

module.exports = mongoose.model('Submission', SubmissionSchema);
