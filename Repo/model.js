const mongoose = require('mongoose');

const RepoSchema = new mongoose.Schema({
  name: {type: String, required: true},
  members: [{type:mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  details: {type: String},
  submission: {type: mongoose.SchemaTypes.ObjectId, ref: 'Submission'},
  tags: [{type: String}]
});

module.exports = mongoose.model('Repo', RepoSchema);
