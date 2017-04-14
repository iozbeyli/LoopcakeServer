const express = require('express');
const controller = require('./controller');
const query = require('./../../utility/query');
const model = require('./model');

module.exports = function (app) {
    const routes = express.Router();

    let getSelect = {};
    let listSelect = {_id: 1, name: 1, university: 1, code: 1, year: 1, term: 1};

    routes.post('/create',   controller.create);
    routes.post('/edit',     controller.edit);
    //routes.post('/remove',   query.remove(model, 'Course'));
    routes.get('/:id',       query.get(model, getSelect, 'Course'));
    routes.get('/',          query.list(model, listSelect, 'Course'));

    app.use('/course', routes);
}