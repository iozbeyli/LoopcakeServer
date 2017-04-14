const mongoose = require('mongoose');


const checkpoint = new mongoose.Schema({
    cpid: {type: String},
    status: {type: Boolean},
    point: {type: Number}
})

const GroupSchema = new mongoose.Schema({
    members: [{type: mongoose.SchemaTypes.ObjectId}],
    name: {type: String, required:true},
    details: {type: String},
    tags: [{type: String}],
    project: {type: mongoose.SchemaTypes.ObjectId},
    course: {type: mongoose.SchemaTypes.ObjectId},
    repo: {type: mongoose.SchemaTypes.ObjectId},
    checklist: [checkpoint]
  });

module.exports = mongoose.model('Group', GroupSchema);
