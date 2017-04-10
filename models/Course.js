const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: {type: String, required:true},
  department: {type: mongoose.SchemaTypes.ObjectId, required:true, ref: 'Department'},
  code: {type: Number, required:true},
  instructor: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  relatedCourses: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Course'}],
  programmingLanguage: {type: String},
  tags: [{type: String}],
  year: {type: Number},
  term: {type: String},
  details: {type: String},
  syllabus: {type: mongoose.SchemaTypes.ObjectId}
});

module.exports = mongoose.model('Course', CourseSchema);
