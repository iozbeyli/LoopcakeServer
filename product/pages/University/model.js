const mongoose = require('mongoose');
const Properties = require('./../../utility/Tools/Properties.js').Properties;

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

UniversitySchema.statics.parseJSON = function(body) {

    let object = {
      name:        body.name ? body.name : null,
      abbreviation:     body.abbreviation ? body.abbreviation : 0,
      country:         body.country ? body.country : null,
      properties:   {}
    };

    object = new this(object);
    if(repOK(object))
      return object;
    else
      return null;
};


const repOK = function(object) {
  return !(isEmpty(object.name)    || isEmpty(object.abbreviation) || 
           isEmpty(object.country)  || !PropertiesModel.repOK(object.properties))
};

module.exports = mongoose.model('University', UniversitySchema);
