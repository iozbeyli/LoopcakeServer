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
const Course = require('./../Course/model');
const Project = require('./../Project/model');
const winston = require('winston')


const checkpoint = new mongoose.Schema({
    cpid: {type: mongoose.SchemaTypes.ObjectId},
    status: {type: Boolean, default: false}
})

const RequestSchema = new mongoose.Schema({
    senderid:   {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    message:    {type: String}
});

const DetailsSchema = new mongoose.Schema({
  date: {type: Date, default: Date.now},
  sections:  [Section]
});

const SubmissionSchema = new mongoose.Schema({
  report:     {type: mongoose.SchemaTypes.ObjectId},
  attachments:[Folder],
  commit:     {type: String},
  message:    {type: String},
  date:       {type: Date, default: Date.now }
});

const GroupSchema = new mongoose.Schema({
    members:    [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
    name:        {type: String, required:true},
    details:     {type: DetailsSchema},
    project:     {type: mongoose.SchemaTypes.ObjectId, ref: 'Project'},
    course:      {type: mongoose.SchemaTypes.ObjectId, ref: 'Course'},
    repo:        {type: mongoose.SchemaTypes.ObjectId, ref: 'Repo'},
    checklist:   [checkpoint],
    joinRequests:[RequestSchema],
    submission:  {type: SubmissionSchema},
    properties:  {type: Properties}
  });

  GroupSchema.methods.isCourseStudent = function(user) {
    return this.members.indexOf(user._id) > -1 ;
  };

  GroupSchema.methods.canAccess = function(user, readOnly) {
  if(!this.properties.active())
    return false;

  if(Auth.canAccess(this.properties, user, readOnly))
    return true;

  if(this.isMember(user))
    return true;

  return Course.findByID(this.course).select("assistants instructors").exec()
  .then(function(course){
    const visibility = readOnly ? this.properties.readVisibility : this.properties.writeVisibility;
    switch(visibility){

      case Visibility.assistants:
        return course.isAssistant(user) || course.isInstructor(user)

      case Visibility.instructor:
        return course.isInstructor(user)

      default:
        return false;
    }
  })
};

  GroupSchema.statics.parseJSON = async function (body, user) {
    let detail = {};
    let properties = {};
    let submission = {};
    if(body.readVisibility)  properties.readVisibility = body.properties.readVisibility;
    if(body.writeVisibility) properties.writeVisibility = body.properties.writeVisibility;

    let object = {
      name:         body.name     || "",
      members:      body.members  || "",
      project:      body.project  || "",
      course:       body.course   || null,
      details:      detail,
      submission:   submission,
      properties:   properties
    };

    if(body.properties) object.properties = properties;
    
    object.properties.owner = user._id;
    const model = this;
    let cl = await getChecklist(object.project)

    object = new model(object);
    for (var index = 0; index < cl.length; index++) {
      var element = cl[index]._id;
      object.checklist.push({cpid: element})
    }

    if(true)
      return object;
    else
      return null;
    
};

GroupSchema.methods.setBy = function(body) {
    let object = {
      name: body.name || this.name
    };

    object = this.set(object);
    if(repOK(object))
      return object;
    else
      return null;
};

GroupSchema.methods.addSection = function(body) {
  let object = Section.parseJSON(body)
  this.details.sections.push(object);
  return this;
};

const getChecklist = async function (projectid){
  return await Project.findById(projectid, "checklist._id").exec()
  .then(function (cl){
    return cl.checklist
  })
}

const repOK = function(object) {
  return !(isEmpty(object.name) || isEmpty(object.members) || isEmpty(object.project) ||
           isEmpty(object.course) || !PropertiesModel.repOK(object.properties))
};


module.exports = mongoose.model('Group', GroupSchema);
