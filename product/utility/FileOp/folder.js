const mongoose = require('mongoose');



const FolderSchema = new mongoose.Schema({
    folder: String,
    attachmentid: {type:mongoose.SchemaTypes.ObjectId},
    filename: {type: String},
    date:     {type: Date, default: Date.now},
})

module.exports = {
    Folder: FolderSchema
}