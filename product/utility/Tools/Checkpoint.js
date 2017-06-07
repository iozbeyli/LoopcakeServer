const mongoose = require('mongoose');


const CheckpointSchema = new Schema({
    label: {type: String},
    point: {type: Number},
    details: {type: String},
    point: {type: Number}
})

module.exports = {
    Checkpoint: CheckpointSchema
}