const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  title: {type: String, required: true},
  content: {type: String},
  author: {type:mongoose.SchemaTypes.ObjectId, ref:'User'},
  date: { type: Date, default: Date.now },
  course: {type:mongoose.SchemaTypes.ObjectId, ref:'Course'}
});
AnnouncementSchema.index({date: 1});

module.exports = mongoose.model('Announcement', AnnouncementSchema);