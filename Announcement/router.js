const express = require('express');
const controller = require('./controller');
const query = require('./../utility/query');
const model = require('./model');

module.exports = function (app) {
    const routes = express.Router();

    let getSelect = {};
    let listSelect = {};

    routes.post('/create',   controller.create);
    routes.post('/remove',   query.remove(model, 'Announcement'));
    routes.get('/:id',       query.get(model, getSelect, 'Announcement'));
    routes.get('/',          query.list(model, listSelect, 'Announcement'));

    app.use('/announcement', routes);
}