const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
const PropertiesModel = require('./../../utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties;
const Auth = require('./../User/Auth.js');
const Course = require('./../Course/model.js');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;

const AnnouncementSchema = new Schema({
  title:    {type: String, required: true},
  content:  {type: String},
  author:   {type:mongoose.SchemaTypes.ObjectId, ref:'User'},
  date:     {type: Date, default: Date.now},
  course:   {type:mongoose.SchemaTypes.ObjectId, ref:'Course'},
  project:  {type:mongoose.SchemaTypes.ObjectId, ref:'Project'},
  properties:   {type: Properties}
});
AnnouncementSchema.index({date: 1});

AnnouncementSchema.methods.canAccess = function(user, readOnly) {
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

AnnouncementSchema.statics.parseJSON = function(body) {

    let properties = {};
    if(body.readVisibility)  properties.readVisibility  = body.properties.readVisibility;
    if(body.writeVisibility) properties.writeVisibility = body.properties.writeVisibility;

    let object = {
      title:      body.title   || "",
      content:    body.content || "",
      author:     body.author  || "",
      course:     body.course  || null,
      project:    body.project || null,
      properties: properties
    };

    if(body.properties) object.properties = properties;

    object = new this(object);
    if(repOK(object))
      return object;
    else
      return null;
};

const repOK = function(object) {
  return !(isEmpty(object.title) || isEmpty(object.content) || isEmpty(object.course) ||
           isEmpty(object.author) || !PropertiesModel.repOK(object.properties))
};

module.exports = mongoose.model('Announcement', AnnouncementSchema);