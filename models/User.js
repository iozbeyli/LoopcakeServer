const mongoose = require('mongoose'),
      crypto = require('crypto'),
      jsonwebtoken = require('jsonwebtoken'),
      Schema = mongoose.Schema,
      University = require('./University'),
      Thread = require('./Thread'),
      Course = require('./Course'),
      Repo = require('./Repo');

const RepoSchema = new Schema({
  id: {type:mongoose.SchemaTypes.ObjectId, ref: 'Repo'},
  name: {type: String}
})

const UserSchema = new Schema({
        name: {type: String, required: true},
        surname: {type: String, required: false},
        email: {type: String, required:false, unique: true},
        universityID: {type: mongoose.SchemaTypes.ObjectId, ref:'University', required:false, unique: true},
        type: {type: String, required:false},
        photo: {type: mongoose.SchemaTypes.ObjectId},
        threads: [{type:mongoose.SchemaTypes.ObjectId, ref: 'Thread'}],
        repos: [RepoSchema],
        hash: String,
        salt: String
});


UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password){
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

UserSchema.methods.generateJwt = function () {
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 15)
  return jsonwebtoken.sign({
    _id: this._id,
    email: this.email,
    expire: parseInt(expiry.getTime() / 1000)
  }, process.env.MY_TOKEN || 'MY_TOKEN')
};




module.exports = mongoose.model('User',UserSchema);
