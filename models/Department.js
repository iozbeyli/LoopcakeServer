const mongoose = require('mongoose'),
      University = require('./University');

const DepartmentSchema = new mongoose.Schema({
  university: {type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'university'},
  name: {type: String,required:true},
  abbreviation: {type: String, required:true}
});

module.exports = mongoose.model('Department', DepartmentSchema);
