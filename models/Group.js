const mongoose = require('mongoose'),
      User = require('./User'),
      Course = require('./Course'),
      Project = require('./Project'),
      Repo = require('./Repo');


const GroupSchema = new mongoose.Schema({
    students: [{type: mongoose.SchemaTypes.ObjectId, ref:'User'}],
    name: {type: String},
    details: {type: String},
    tags: [{type: String}],
    projectID: {type: mongoose.SchemaTypes.ObjectId, ref:'Project'},
    repo: {type: mongoose.SchemaTypes.ObjectId, ref: 'Repo'},
    clLabels: [{type: String}],
    clStatus: [{type: Boolean}],
    clPoints: [{type: Number}]
  });

module.exports = mongoose.model('Group', GroupSchema);
