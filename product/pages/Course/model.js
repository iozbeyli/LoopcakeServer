const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Folder = require('./../../utility/FileOp/folder.js').Folder;
const Section = require('./../../utility/section.js').Section;
const PropertiesModel = require('./../../utility/Tools/Properties.js').Properties;
const Properties = PropertiesModel.Properties
const Visibility = require('./../../utility/Tools/Visibility.json');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;

const CourseSchema = new mongoose.Schema({
  name:         {type: String, required:true},
  abbreviation: {type: String, required:true},
  code:         {type: String, required:true},
  department:   {type: mongoose.SchemaTypes.ObjectId, required:true, ref: 'University'},        
  instructors: [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  students:    [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  assistants:  [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  details:      {type: DetailsSchema},
  syllabus:     {type: mongoose.SchemaTypes.ObjectId},
  attachments: [{type: Folder}],
  properties:   {type: Properties}
});

const DetailsSchema = new mongoose.Schema({
  sections:  [Section],
  year:      {type: String},
  term:      {type: String},
  programmingLanguages: [{type: String}],
  relatedCourses:  [{type: mongoose.SchemaTypes.ObjectId, ref: 'Course'}],
});

CourseSchema.methods.isCourseStudent = function(user) {
  return this.students.indexOf(user._id) > -1 ;
};

CourseSchema.methods.isInstructor = function(user) {
  return this.instructors.indexOf(user._id) > -1 ;
};

CourseSchema.methods.isAssistant = function(user) {
  return this.assistants.indexOf(user._id) > -1 ;
};

CourseSchema.methods.canAcess = function(user) {
  const visibility = this.properties.visibility;

  switch(visibility){
    case Visibility.courseStudent:
      return this.isCourseStudent(user) || this.isAssistant(user) || 
             this.isInstructor(user)    || this.properties.isOwner(user);

    case Visibility.assistants:
      return this.isAssistant(user) || this.isInstructor(user) || this.properties.isOwner(user);

    case Visibility.instructor:
      return this.isInstructor(user) || this.properties.isOwner(user);

    default:
      return this.properties.isOwner(user);
  }
};

exports.parseJSON = function(body) {
    i
    let detail = {
      year: body.year,
      term: body.term
    }
    let property = {
      visibility: body.visibility
    }
    let object = {
      name:         body.name,
      abbreviation: body.abbreviation,
      code:         body.code,
      department:   body.department,        
      instructors:  body.instructors,
      students:     body.students,
      assistants:   body.assistants,
      details:      detail,
      properties:   property
    };

    if(repOK(object))
      return object;
    else
      return null;
};


const repOK = function(object) {
  return !(isEmpty(object.name) || isEmpty(object.abbreviation) || isEmpty(object.department) ||
           isEmpty(object.code) || isEmpty(object.instructors)  || !PropertiesModel.repOK(object.properties))
};

module.exports = mongoose.model('Course', CourseSchema);

