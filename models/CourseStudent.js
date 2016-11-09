const mongoose = require('mongoose'),
      User = require('./User'),
      Course = require('./Course');

const CourseStudentSchema = new mongoose.Schema({
  course: {type:mongoose.SchemaTypes.ObjectId, ref: 'Course'},
  student: {type:mongoose.SchemaTypes.ObjectId, ref: 'Student'},
  isAssistant: {type: Boolean}
});

module.exports = mongoose.model('CourseStudent', CourseStudentSchema);
