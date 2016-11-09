const mongoose = require('mongoose'),
      Group = require('./Group');

const ProjectSchema = new mongoose.Schema({
  name: {type: String, required:true},
  groups: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Group'}],
  details: {type: String},
  attachment: [{type: String}]
});

module.exports = mongoose.model('Project', ProjectSchema);
