const mongoose = require('mongoose'),
      Group = require('./Group'),
      Schema = mongoose.Schema,
      Course = require('./Course');

const attachmentSchema = new Schema({
    attachmentid: {type:mongoose.SchemaTypes.ObjectId},
    filename: {type: String}
})

const ProjectSchema = new mongoose.Schema({
  name: {type: String, required:true},
  groups: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Group'}],
  details: {type: String},
  courseID: {type: mongoose.SchemaTypes.ObjectId, ref: 'Course'},
  attachment: [attachmentSchema],
  maxGroupSize: {type: Number},
  deadline: {type: Date},
  tags: [{type: String}]
});

module.exports = mongoose.model('Project', ProjectSchema);
