const mongoose = require('mongoose');

const CourseStudentSchema = new mongoose.Schema({
  courseID: {type:mongoose.SchemaTypes.ObjectId, ref: 'Course'},
  studentID: {type:mongoose.SchemaTypes.ObjectId, ref: 'Student'},
  isAssistant: {type: Boolean}
});

CourseStudentSchema.index({courseID: 1, studentID: 1}, {unique: true});

module.exports = mongoose.model('CourseStudent', CourseStudentSchema);
