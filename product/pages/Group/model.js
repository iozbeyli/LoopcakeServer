const mongoose = require('mongoose');
const Folder = require('./../../utility/FileOp/folder.js').Folder;
const Section = require('./../../utility/section.js').Section;


const checkpoint = new mongoose.Schema({
    cpid: {type: String},
    status: {type: Boolean}
})

const GroupSchema = new mongoose.Schema({
    members:    [{type: mongoose.SchemaTypes.ObjectId, ref: 'User'}],
    name:        {type: String, required:true},
    details:     {type: DetailsSchema},
    project:     {type: mongoose.SchemaTypes.ObjectId, ref: 'Project'},
    course:      {type: mongoose.SchemaTypes.ObjectId, ref: 'Course'},
    repo:        {type: mongoose.SchemaTypes.ObjectId, ref: 'Repo'},
    checklist:   [checkpoint],
    joinRequests:[RequestSchema],
    submission:  {type: SubmissionSchema}
  });

const RequestSchema = new mongoose.Schema({
    senderid:   {type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    message:    {type: String}
});

const DetailsSchema = new mongoose.Schema({
  date: {type: Date, default: Date.now},
  sections:  [Section]
});

const SubmissionSchema = new mongoose.Schema({
  report:     {type: mongoose.SchemaTypes.ObjectId},
  attachments:[Folder],
  commit:     {type: String},
  message:    {type: String},
  date:       {type: Date, default: Date.now }
});


module.exports = mongoose.model('Group', GroupSchema);
