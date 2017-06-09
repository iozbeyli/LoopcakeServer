const jsonwebtoken = require('jsonwebtoken'),
      mongoose = require('mongoose');
      Schema = mongoose.Schema;
      const Properties = require('./../../utility/Tools/Properties.js').Properties;

const UserSchema = new Schema({    
    email:        {type: String, required: true, unique: true},
    userType:     {type: Number, required: true},
    name:         {type: String, required: true},
    surname:      {type: String, required: true},
    username:     {type: String},
    universityID: {type: String},
    university:   {type: mongoose.SchemaTypes.ObjectId, ref:'University'},
    keys:        [{type: String}],
    photo:        {type: mongoose.SchemaTypes.ObjectId},
    hash:         {type: String, required: true},
    properties:   {type: Properties}
});

UserSchema.methods.generateJwt = function() {
  return jsonwebtoken.sign({
    _id:      this._id,
    mail :    this.mail,
    name:     this.name,
    surname:  this.surname,
    username: this.username,
    studentID:this.studentID,
    keys:     this.keys,
  }, (process.env.MY_TOKEN || config.JWTSecret), { expiresIn: config.JWTExpiration });
};

const USER_TYPES = {
    "regular":      0,
    "student":      1,
    "assistant":    3,
    "instructor":   4,
    "moderator":    5,
    "admin":        6
}

module.exports = mongoose.model('User',UserSchema);