const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Folder = require('./../../utility/FileOp/folder.js').Folder,
      Checkpoint = require('./../../utility/Tools/Checkpoint.js').Checkpoint;
const Section = require('./../../utility/section.js').Section;


const ProjectSchema = new mongoose.Schema({
  name:         {type: String, required:true},
  details:      {type: DetailsSchema},
  course:       {type: mongoose.SchemaTypes.ObjectId, ref: 'Course'},
  attachment:   [Folder],
  maxGroupSize: {type: Number},
  deadline:     {type: Date},
  date:         {type: Date, default: Date.now},
  checklist:    [Checkpoint]
});

const DetailsSchema = new mongoose.Schema({
  sections:  [Section]
});

module.exports = mongoose.model('Project', ProjectSchema);
