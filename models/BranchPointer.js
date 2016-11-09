const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      User = require('./User');

const BranchPointerSchema = new Schema({
  currentUser: {type:mongoose.SchemaTypes.ObjectId, ref: 'User'},
  currentVersion: {type: Number},
  pastUser: {type:mongoose.SchemaTypes.ObjectId, ref:'User'},
  pastVersion: {type: Number},
  fileLocation: {type: String}
});

module.exports = mongoose.model('BranchPointer', BranchPointerSchema);
