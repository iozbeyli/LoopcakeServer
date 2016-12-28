const mongoose = require('mongoose'),
      User = require('./User'),
      Course = require('./Course'),
      Project = require('./Project'),
      Schema = mongoose.Schema,
      Repo = require('./Repo');

const checkpoint = new Schema({
    cpid: {type: String},
    status: {type: Boolean},
    point: {type: Number}
})

const GroupSchema = new mongoose.Schema({
    students: [{type: mongoose.SchemaTypes.ObjectId, ref:'User'}],
    name: {type: String},
    details: {type: String},
    tags: [{type: String}],
    project: {type: mongoose.SchemaTypes.ObjectId, ref:'Project'},
    course: {type: mongoose.SchemaTypes.ObjectId, ref:'Course'},
    repo: {type: mongoose.SchemaTypes.ObjectId, ref: 'Repo'},
    checklist: [checkpoint]
  });

module.exports = mongoose.model('Group', GroupSchema);
