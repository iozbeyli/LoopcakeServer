const jsonwebtoken = require('jsonwebtoken'),
      mongoose = require('mongoose');
      Schema = mongoose.Schema;
const UserType = require('./userTypes.json');
const utility = require('./../../utility/utility.js');
const config = require('./../../config.json');
const isEmpty = utility.isEmpty;
const types = Object.keys(UserType).map(function(k) { return UserType[k] });
const PropertiesModel = require('./../../utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties;
const Auth = require('./Auth.js');

const UserSchema = new Schema({    
    email:        {type: String, required: true, unique: true},
    userType:     {type: Number, required: true, default: UserType.regular},
    name:         {type: String, required: true},
    surname:      {type: String, required: true},
    username:     {type: String},
    universityID: {type: String},
    isAdmin:      {type: Boolean, select: false, default: false},
    university:   {type: mongoose.SchemaTypes.ObjectId, ref:'University'},
    keys:        [{type: String}],
    photo:        {type: mongoose.SchemaTypes.ObjectId},
    hash:         {type: String, select: false},
    properties:   {type: Properties}
});

UserSchema.methods.generateJwt = function() {
  return jsonwebtoken.sign({
    _id:            this._id,
    mail :          this.mail,
    name:           this.name,
    surname:        this.surname,
    username:       this.username,
    userType:       this.userType,
    keys:           this.keys,
    universityID:   this.universityID,
    university:     this.university,
    isAdmin:        this.isAdmin
  }, (process.env.MY_TOKEN || config.JWTSecret), { expiresIn: config.JWTExpiration });
};

UserSchema.methods.canAccess = function(user, readOnly) {
  if(!this.properties.active())
    return false;

  if(Auth.canAccess(this.properties, user, readOnly))
    return true;
};

UserSchema.statics.parseJSON = function(body) {

    let properties = {};
    if(body.properties){
      if(body.properties.readVisibility)  properties.readVisibility = body.properties.readVisibility;
      if(body.properties.writeVisibility) properties.writeVisibility = body.properties.writeVisibility;
    }

    let object = {
      email:        body.email        || null,
      userType:     body.userType     || 0,
      name:         body.name         || null,
      surname:      body.surname      || null,
      username:     body.username     || null,
      universityID: body.universityID || null,
      university:   body.university   || null,
      photo:        body.photo        || null,
      hash:         body.hash         || null,
      properties:   properties
    };

    if(body.properties) object.properties = properties;

    object = new this(object);
    if(repOK(object))
      return object;
    else
      return null;
};

UserSchema.methods.setBy = function(body) {

    let object = {
      email:        body.email        || this.email,
      userType:     body.userType     || this.userType,
      name:         body.name         || this.name,
      surname:      body.surname      || this.surname,
      username:     body.username     || this.username,
      universityID: body.universityID || this.universityID,
    };

    object = this.set(object);
    if(repOK(object))
      return object;
    else
      return null;
};


const repOK = function(object) {
  return !(isEmpty(object.email)    || isEmpty(object.name) || 
           isEmpty(object.surname)  || !(types.indexOf(object.userType) > -1) || !PropertiesModel.repOK(object.properties))
};

module.exports = mongoose.model('User',UserSchema);