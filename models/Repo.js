const mongoose = require('mongoose'),
      User = require('./User'),
      BranchPointer = require('./BranchPointer'),
      Submission = require('./Submission'),
      RepoComment = require('./RepoComment');

const RepoSchema = new mongoose.Schema({
  name: {type: String, required: true},
  members: [{type:mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  isRepoPersonal: {type: Boolean},
  details: {type: String},
  collaborators: [{type:mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  branchPointers: [{type: mongoose.SchemaTypes.ObjectId, ref: 'BranchPointer'}],
  submission: {type: mongoose.SchemaTypes.ObjectId, ref: 'Submission'},
  repoComment: {type: mongoose.SchemaTypes.ObjectId, ref: 'RepoComment'},
  tags: [{type: String}]
});

module.exports = mongoose.model('Repo', RepoSchema);
