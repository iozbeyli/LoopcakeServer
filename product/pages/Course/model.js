const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Folder = require('./../../utility/FileOp/folder.js').Folder;
const Section = require('./../../utility/section.js').Section;
const PropertiesModel = require('./../../utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties
const Visibility = require('./../../utility/Tools/Visibility.json');
const utility = require('./../../utility/utility.js');
const Auth = require('./../User/Auth.js');
const isEmpty = utility.isEmpty;

const DetailsSchema = new mongoose.Schema({
  sections:  [Section],
  year:      {type: String},
  term:      {type: String},
  programmingLanguages: [{type: String}],
  relatedCourses:  [{type: mongoose.SchemaTypes.ObjectId, ref: 'Course'}],
});

const CourseSchema = new mongoose.Schema({
  name:         {type: String, required:true},
  abbreviation: {type: String, required:true},
  code:         {type: String, required:true},
  department:   {type: mongoose.SchemaTypes.ObjectId, ref: 'University'},        
  instructors: [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  students:    [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  assistants:  [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  details:      {type: DetailsSchema},
  syllabus:     {type: mongoose.SchemaTypes.ObjectId},
  attachments: [Folder],
  properties:   Properties
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

CourseSchema.methods.canAccess = function(user, readOnly) {
  if(!this.properties.active())
    return false;

  if(Auth.canAccess(this.properties, user, readOnly))
    return true;

  const visibility = readOnly ? this.properties.readVisibility : this.properties.writeVisibility;

  switch(visibility){
    case Visibility.class:
      return this.isCourseStudent(user) || this.isAssistant(user) || this.isInstructor(user)

    case Visibility.assistants:
      return this.isAssistant(user) || this.isInstructor(user)

    case Visibility.instructor:
      return this.isInstructor(user)

    default:
      return false;
  }
};

CourseSchema.statics.parseJSON = function(body) {
    let detail = {};
    if(body.year) detail.year = body.year;
    if(body.term) detail.term = body.term;

    let properties = {};
    if(body.properties){
      if(body.properties.readVisibility)  properties.readVisibility = body.properties.readVisibility;
      if(body.properties.writeVisibility) properties.writeVisibility = body.properties.writeVisibility;
    }

    let object = {
      name:         body.name ? body.name : "",
      abbreviation: body.abbreviation ? body.abbreviation : "",
      code:         body.code ? body.code : "",
      department:   body.department ? body.department : null,
      details:      detail,
      properties:   properties
    };

    if(body.properties) object.properties = properties;

    object = new this(object);
    if(repOK(object))
      return object;
    else
      return null;
};

CourseSchema.methods.setBy = function(body) {
    let object = {
      name:         body.name ? body.name : this.name,
      abbreviation: body.abbreviation ? body.abbreviation : this.abbreviation,
      code:         body.code ? body.code : this.code,
      department:   body.department ? body.department : this.department
    };

    object = this.set(object);
    if(repOK(object))
      return object;
    else
      return null;
};


const repOK = function(object) {
  return !(isEmpty(object.name) || isEmpty(object.abbreviation) ||
           isEmpty(object.code) || !PropertiesModel.repOK(object.properties))
};

module.exports = mongoose.model('Course', CourseSchema);

