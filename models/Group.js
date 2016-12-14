const mongoose = require('mongoose'),
      User = require('./User'),
      Course = require('./Course'),
      Project = require('./Project'),
      Schema = mongoose.Schema,
      Repo = require('./Repo');

const checkpoint = new Schema({
    cpid: {type: String},
    status: {type: Boolean}
})

const GroupSchema = new mongoose.Schema({
    students: [{type: mongoose.SchemaTypes.ObjectId, ref:'User'}],
    name: {type: String},
    details: {type: String},
    tags: [{type: String}],
    projectID: {type: mongoose.SchemaTypes.ObjectId, ref:'Project'},
    repo: {type: mongoose.SchemaTypes.ObjectId, ref: 'Repo'},
    checklist: [checkpoint]
  });

module.exports = mongoose.model('Group', GroupSchema);
