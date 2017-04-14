const express = require('express');
const controller = require('./controller');
const query = require('./../../utility/query');
const model = require('./model');

module.exports = function (app) {
    const routes = express.Router();

    let getSelect = {hash: 0};
    let listSelect = {
        _id: 1,
        username: 1,
        name: 1,
        surname: 1
    };

    routes.post('/register', controller.register);
    routes.post('/edit',     controller.edit);
    routes.post('/login',    controller.login);
    routes.post('/remove',   query.remove(model, 'User'));
    routes.get('/:id',       query.get(model, getSelect, 'User'));
    routes.get('/',          query.list(model, listSelect, 'User'));

    app.use('/user', routes);
}