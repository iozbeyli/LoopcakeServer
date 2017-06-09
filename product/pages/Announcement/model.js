const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
      const Properties = require('./../../utility/Tools/Properties.js').Properties;

const AnnouncementSchema = new Schema({
  title:    {type: String, required: true},
  content:  {type: String},
  author:   {type:mongoose.SchemaTypes.ObjectId, ref:'User'},
  date:     {type: Date, default: Date.now},
  course:   {type:mongoose.SchemaTypes.ObjectId, ref:'Course'},
  project:  {type:mongoose.SchemaTypes.ObjectId, ref:'Project'},
  properties:   {type: Properties}
});
AnnouncementSchema.index({date: 1});



module.exports = mongoose.model('Announcement', AnnouncementSchema);