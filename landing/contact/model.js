const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
const PropertiesModel = require('./../../product/utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties;
const utility = require('./../../product/utility/utility.js');
const isEmpty = utility.isEmpty;

const ContactSchema = new Schema({
  name:         {type: String, required: true},
  surname:      {type: String, required: true},
  email:        {type: String, required: true},
  type:         {type: String, required: true},
  message:      {type: String},
  institution:  {type: String},
  country:      {type: String},
  date:         {type: Date, default: Date.now},
  properties:   {type: Properties}
});
ContactSchema.index({date: 1});

ContactSchema.methods.canAccess = function(user, readOnly) {
  if(readOnly){
    return user ? user.isAdmin : false
  }else{
    return true
  }
};

ContactSchema.statics.parseJSON = function(body, user) {
  properties= {};

    let object = {
      name:         body.name         || "",
      surname:      body.surname      || "",
      email:        body.email        || "",
      type:         body.type         || "",
      message:      body.message      || "",
      institution:  body.institution  || "",
      country:      body.country      || "",
      properties:   properties
    };
    object = new this(object);
    if(repOK(object))
      return object;
    else
      return null;
};

const repOK = function(object) {
  return !(isEmpty(object.email) || isEmpty(object.name) || isEmpty(object.surname) ||
           isEmpty(object.type) || !PropertiesModel.repOK(object.properties))
};

module.exports = mongoose.model('Contact', ContactSchema);