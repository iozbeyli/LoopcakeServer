const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      User = require('./User'),
      Course = require('./Course');

const AnnouncementSchema = new Schema({
  title: {type: String},
  content: {type: String},
  author: {type:mongoose.SchemaTypes.ObjectId, ref:'User'},
  date: { type: Date, default: Date.now },
  course: {type:mongoose.SchemaTypes.ObjectId, ref:'Course'}
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
