const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Folder = require('./../../utility/FileOp/folder.js').Folder;
const Section = require('./../../utility/section.js').Section;
const PropertiesModel = require('./../../utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties;
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;
const Auth = require('./../User/Auth.js');
const Course = require('./../Course/model');
const Project = require('./../Course/model');
const DetailsSchema = new mongoose.Schema({
  sections:  [Section]
});

const CheckpointSchema = new Schema({
    label: {type: String},
    point: {type: Number},
    details: {type: String}
})

const ProjectSchema = new mongoose.Schema({
  name:         {type: String, required:true},
  details:      {type: DetailsSchema},
  course:       {type: mongoose.SchemaTypes.ObjectId, required:true, ref: 'Course'},
  attachments:   [Folder],
  maxGroupSize: {type: Number,  required:true},
  deadline:     {type: Date,    required:true},
  checklist:    [CheckpointSchema],
  properties:   {type: Properties}
});


ProjectSchema.methods.addCheckpoint = function(body) {

  let object = {};
  object.label    = body.label;
  object.details  = body.details;
  object.point    = body.point;
  this.checklist.push(object);
  return this;
};

ProjectSchema.methods.canAccess = function(user, readOnly) {
  if(!this.properties.active())
    return false;

  if(Auth.canAccess(this.properties, user, readOnly))
    return true;

  return Course.findByID(this.course).exec()
  .then(function(course){
    const visibility = readOnly ? this.properties.readVisibility : this.properties.writeVisibility;
    switch(visibility){
      case Visibility.class:
       return course.isCourseStudent(this.course, user) || course.isAssistant(user) || course.isInstructor(user)

      case Visibility.assistants:
        return course.isAssistant(user) || course.isInstructor(user)

      case Visibility.instructor:
        return course.isInstructor(user)

      default:
        return false;
    }
  })
};

ProjectSchema.statics.parseJSON = function(body, user) {
    let detail = {};
    let properties = {};
    if(body.readVisibility)  properties.readVisibility  = body.properties.readVisibility;
    if(body.writeVisibility) properties.writeVisibility = body.properties.writeVisibility;
    let object = {
      name:           body.name         || "",
      maxGroupSize:   body.maxGroupSize || -1,
      course:         body.course       || null,
      details:        detail,
      properties:     properties
    };

    if(body.deadline) object.deadline = new Date (body.deadline);

    object.properties.owner = user._id;
    object = new this(object);
    if(repOK(object))
      return object;
    else
      return null;
};

const repOK = function(object) {
  return !(isEmpty(object.course) || isEmpty(object.deadline) || object.maxGroupSize < 1 ||
           isEmpty(object.name)   || !PropertiesModel.repOK(object.properties))
};

module.exports = mongoose.model('Project', ProjectSchema);
