const mongoose = require('mongoose'),
      Group = require('./Group'),
      Course = require('./Course');

const ProjectSchema = new mongoose.Schema({
  name: {type: String, required:true},
  groups: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Group'}],
  details: {type: String},
  courseID: {type: mongoose.SchemaTypes.ObjectId, ref: 'Course'},
  attachment: [{type: mongoose.SchemaTypes.ObjectId}],
  maxGroupSize: {type: Number},
  deadline: {type: Date},
  tags: [{type: String}]
});

module.exports = mongoose.model('Project', ProjectSchema);
