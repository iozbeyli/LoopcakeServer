const mongoose = require('mongoose');


const AttachmentSchema = new mongoose.Schema({
    attachmentid: {type:mongoose.SchemaTypes.ObjectId},
    filename: {type: String},
    date:     {type: Date, default: Date.now},
    folder: {type: String},

})

const FolderSchema = new mongoose.Schema({
    name: String,
    attachments: [AttachmentSchema]
})

module.exports = {
    Folder: FolderSchema,
    Attachment: AttachmentSchema
}