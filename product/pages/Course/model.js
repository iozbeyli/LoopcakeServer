const mongoose = require('mongoose');
const Folder = require('./../../utility/FileOp/folder.js').Folder;
const Section = require('./../../utility/section.js').Section;

const CourseSchema = new mongoose.Schema({
  name:         {type: String, required:true},
  abbreviation: {type: String, required:true},
  code:         {type: String, required:true},
  department:   {type: mongoose.SchemaTypes.ObjectId, required:true, ref: 'University'},        
  instructor:   {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
  students:    [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  assistants:  [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  details:      {type: DetailsSchema},
  syllabus:     {type: mongoose.SchemaTypes.ObjectId},
  attachments: [{type: Folder}]
});

const DetailsSchema = new mongoose.Schema({
  sections:  [Section],
  year:      {type: String},
  term:      {type: String},
  programmingLanguages: [{type: String}],
  relatedCourses:  [{type: mongoose.SchemaTypes.ObjectId, ref: 'Course'}],
});


module.exports = mongoose.model('Course', CourseSchema);

