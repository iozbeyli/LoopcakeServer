const express = require('express');

const contactRouter          = require('./contact/router');

module.exports = function(app) {
  contactRouter(app);
}
