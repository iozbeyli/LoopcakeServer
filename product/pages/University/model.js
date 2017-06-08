const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
  name:         {type: String, required: true, unique:true},
  abbreviation: {type: String, required:true},
  country:      {type: String, required: true},
  database:     DatabaseSchema,
  departments:  [DepartmentSchema]
});

const DatabaseSchema = new mongoose.Schema({
  baseURL:  {type: String, required: true},
  name:     {type: String, required: true},
  date:     {type: Date, default: Date.now}
});

const DepartmentSchema = new mongoose.Schema({
  name:         {type: String, required: true},
  abbreviation: {type: String, required:true}
});

module.exports = mongoose.model('University', UniversitySchema);
