const express = require('express');
const controller = require('./controller');
const query = require('./../../utility/query');
const model = require('./model');

module.exports = function (app) {
    const routes = express.Router();

    let getSelect = {};
    let listSelect = {};

    routes.post('/create',   controller.create);
    routes.post('/edit',     controller.edit);
    routes.post('/remove',   query.remove(model, 'University'));
    routes.get('/:id',       query.get(model, getSelect, 'University'));
    routes.get('/',          query.list(model, listSelect, 'University'));

    app.use('/university', routes);
}