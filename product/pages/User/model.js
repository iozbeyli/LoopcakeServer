const jsonwebtoken = require('jsonwebtoken'),
      mongoose = require('mongoose');
      Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:   {type: String, required: true, unique: true},
    name:       {type: String, required: true},
    surname:    {type: String, required: false},
    email:      {type: String, required: true, unique: true},
    university: {type: mongoose.SchemaTypes.ObjectId, ref:'University'},
    access:     [AccessSchema],
    photo:      {type: mongoose.SchemaTypes.ObjectId},
    hash:       {type: String, required: false}
});

const AccessSchema = new Schema({
    target:     {type: String, required: true},
    canAccess:  {type: Boolean, default: false}
});

UserSchema.methods.generateJwt = function() {
  return jsonwebtoken.sign({
    _id:      this._id,
    username: this.username,
    mail :    this.mail,
    name:     this.name,
    surname:  this.surname,
    access:   this.access
  }, (process.env.MY_TOKEN || config.JWTSecret), { expiresIn: config.JWTExpiration });
};

module.exports = mongoose.model('User',UserSchema);