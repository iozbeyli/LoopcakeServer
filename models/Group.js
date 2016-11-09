const mongoose = require('mongoose'),
      User = require('./User'),
      Course = require('./Course'),
      Repo = require('./Repo');

const GroupSchema = new mongoose.Schema({
    students: [{type: mongoose.SchemaTypes.ObjectId, ref:'User'}],
    name: {type: String},
    details: {type: String},
    course: {type: mongoose.SchemaTypes.ObjectId, ref:'Course'},
    repo: {type: mongoose.SchemaTypes.ObjectId, ref: 'Repo'}
  });

module.exports = mongoose.model('Group', GroupSchema);
