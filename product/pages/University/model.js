const mongoose = require('mongoose');
const utility = require('./../../utility/utility.js');
const isEmpty = utility.isEmpty;
const PropertiesModel = require('./../../utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties;
const Auth = require('./../User/Auth.js');

const DatabaseSchema = new mongoose.Schema({
  baseURL:  {type: String, required: true},
  name:     {type: String, required: true},
  date:     {type: Date, default: Date.now}
});

const DepartmentSchema = new mongoose.Schema({
  name:         {type: String, required: true},
  abbreviation: {type: String, required:true}
});

const UniversitySchema = new mongoose.Schema({
  name:         {type: String, required: true, unique:true},
  abbreviation: {type: String, required:true},
  country:      {type: String, required: true},
  database:     DatabaseSchema,
  departments:  [DepartmentSchema],
  properties:   {type: Properties}
});


UniversitySchema.methods.canAccess = function(user, readOnly) {
  if(!this.properties.active())
    return false;

  if(Auth.canAccess(this.properties, user, readOnly))
    return true;
};

UniversitySchema.methods.addDepartment = function(body) {
  let object = {};
  object.name = body.name;
  object.abbreviation = body.abbreviation;
  this.departments.push(object);
  return this;
};

UniversitySchema.statics.parseJSON = function(body, user) {

    let object = {
      name:          body.name          || null,
      abbreviation:  body.abbreviation  || null,
      country:       body.country       || null,
      properties:   {}
    };

    object.properties.owner = user._id;
    object = new this(object);
    if(repOK(object))
      return object;
    else
      return null;
};


UniversitySchema.methods.setBy = function(body) {

    let object = {
      name:           body.name         || this.name,
      abbreviation:   body.abbreviation || this.abbreviation,
      country:        body.country      || this.country,
    };

    this.set(object);
    if(repOK(this))
      return object;
    else
      return null;
};

UniversitySchema.statics.findByDepartmentID = function(departmentid) {
  return this.findOne({"departments._id": departmentid}).exec();
};



const repOK = function(object) {
  return !(isEmpty(object.name)    || isEmpty(object.abbreviation) || 
           isEmpty(object.country)  || !PropertiesModel.repOK(object.properties))
};

module.exports = mongoose.model('University', UniversitySchema);
