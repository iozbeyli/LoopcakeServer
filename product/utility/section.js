const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  title: String,
  content: String
});

SectionSchema.parseJSON = function(body) {
    object = {
      title: body.title,
      content: body.content
    }
    return object;
};

SectionSchema.setBy = function(section, body) {
    object = {
      title: body.title     || section.title,
      content: body.content || section.content
    }
    section.set(object)
    return section;
};

module.exports = {
    Section: SectionSchema,
}