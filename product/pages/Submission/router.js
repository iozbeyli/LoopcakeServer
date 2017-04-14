const express = require('express');
const controller = require('./controller');
const query = require('./../../utility/query');
const model = require('./model');

module.exports = function (app) {
    const routes = express.Router();

    let getSelect = {};
    let listSelect = {};

    //routes.post('/create',   controller.create);
    routes.post('/edit',     controller.edit);
    //routes.post('/remove',   query.remove(model, 'Submission'));
    routes.get('/:id',       query.get(model, getSelect, 'Submission'));
    routes.get('/',          query.list(model, listSelect, 'Submission'));
    //apiRoutes.post('/getSubmission',    submissionController.getSubmission);
    //apiRoutes.get('/getAllSubmissions', submissionController.getAllSubmissions);

    app.use('/submission', routes);
}