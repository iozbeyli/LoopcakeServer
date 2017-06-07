const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
    name: String,
    attachments: [attachmentSchema]
})

const AttachmentSchema = new mongoose.Schema({
    attachmentid: {type:mongoose.SchemaTypes.ObjectId},
    filename: {type: String},
    date:     {type: Date, default: Date.now},
    folder: {type: String},

})

module.exports = {
    Folder: FolderSchema,
    Attachment: AttachmentSchema
}