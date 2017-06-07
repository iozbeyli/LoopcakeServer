const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  title: String,
  content: String
});

module.exports = {
    Section: SectionSchema
}