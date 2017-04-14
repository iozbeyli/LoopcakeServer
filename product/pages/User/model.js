const jsonwebtoken = require('jsonwebtoken'),
      mongoose = require('mongoose');
      Schema = mongoose.Schema;

const UserSchema = new Schema({
        username: {type: String, required: true, unique: true},
        name: {type: String, required: true},
        surname: {type: String, required: false},
        email: {type: String, required:false, unique: true},
        universityID: {type: mongoose.SchemaTypes.ObjectId, ref:'University', required:false},
        type: {type: String, required:false},
        photo: {type: mongoose.SchemaTypes.ObjectId},
        hash: String
});

UserSchema.methods.generateJwt = function() {
  return jsonwebtoken.sign({
    _id:      this._id,
    username: this.username,
    mail : this.mail,
    name: this.name,
    surname: this.surname
  }, (process.env.MY_TOKEN || config.JWTSecret), { expiresIn: config.JWTExpiration });
};

module.exports = mongoose.model('User',UserSchema);