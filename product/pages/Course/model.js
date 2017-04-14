const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: {type: String, required:true},
  university: {type: mongoose.SchemaTypes.ObjectId, required:true},
  code: {type: String, required:true},
  instructor: {type: mongoose.SchemaTypes.ObjectId},
  relatedCourses: [{type: mongoose.SchemaTypes.ObjectId}],
  students: [{type: mongoose.SchemaTypes.ObjectId}],
  assistants: [{type: mongoose.SchemaTypes.ObjectId}],
  programmingLanguage: {type: String},
  tags: [{type: String}],
  year: {type: Number},
  term: {type: String},
  details: {type: String},
  syllabus: {type: mongoose.SchemaTypes.ObjectId}
});

module.exports = mongoose.model('Course', CourseSchema);

/*const CourseStudentSchema = new mongoose.Schema({
  courseID: {type:mongoose.SchemaTypes.ObjectId, ref: 'Course'},
  studentID: {type:mongoose.SchemaTypes.ObjectId, ref: 'Student'},
  isAssistant: {type: Boolean}
});

CourseStudentSchema.index({courseID: 1, studentID: 1}, {unique: true});

module.exports = mongoose.model('CourseStudent', CourseStudentSchema);
*/
