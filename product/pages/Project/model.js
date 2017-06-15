const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Folder = require('./../../utility/FileOp/folder.js').Folder,
      Checkpoint = require('./../../utility/Tools/Checkpoint.js').Checkpoint;
const Section = require('./../../utility/section.js').Section;
const Properties = require('./../../utility/Tools/Properties.js').Properties;

const DetailsSchema = new mongoose.Schema({
  sections:  [Section]
});

const ProjectSchema = new mongoose.Schema({
  name:         {type: String, required:true},
  details:      {type: DetailsSchema},
  course:       {type: mongoose.SchemaTypes.ObjectId, required:true, ref: 'Course'},
  attachment:   [Folder],
  maxGroupSize: {type: Number,  required:true},
  deadline:     {type: Date,    required:true},
  checklist:    [Checkpoint],
  properties:   {type: Properties}
});


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
  return !(isEmpty(object.course) || isEmpty(object.deadline) || maxGroupSize < 1 ||
           isEmpty(object.name)   || !PropertiesModel.repOK(object.properties))
};

module.exports = mongoose.model('Project', ProjectSchema);
