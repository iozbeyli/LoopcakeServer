const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const attachmentSchema = new Schema({
    attachmentid: {type:mongoose.SchemaTypes.ObjectId},
    filename: {type: String}
})

const checkpoint = new Schema({
    label: {type: String},
    point: {type: Number},
    details: {type: String}
})

const ProjectSchema = new mongoose.Schema({
  name: {type: String, required:true},
  details: {type: String},
  courseID: {type: mongoose.SchemaTypes.ObjectId, ref: 'Course'},
  attachment: [attachmentSchema],
  maxGroupSize: {type: Number},
  deadline: {type: Date},
  tags: [{type: String}],
  checklist: [checkpoint]
});

module.exports = mongoose.model('Project', ProjectSchema);
