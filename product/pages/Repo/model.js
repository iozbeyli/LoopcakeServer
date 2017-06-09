const mongoose = require('mongoose');
const Properties = require('./../../utility/Tools/Properties.js').Properties;

const RepoSchema = new mongoose.Schema({
  name:          {type: String, required: true},
  members:      [{type:mongoose.SchemaTypes.ObjectId, ref: 'User'}],
  dedescription: {type: String},
  date:     {type: Date, default: Date.now},
  comments:      [CommentSchema],
  properties:   {type: Properties}
});


const CommentSchema = new mongoose.Schema({
  message:    {type: String, required: true},
  author:     {type:mongoose.SchemaTypes.ObjectId, ref:'User'},
  date:       {type: Date, default: Date.now},
  file:       {type: String},
  line:       {type: String},
  commit:     {type: String},
  branch:     {type: String},
  visibility: {type: String}
});

module.exports = mongoose.model('Repo', RepoSchema);
