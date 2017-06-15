const express = require('express');
const controller = require('./controller');
const query = require('./../../utility/query');
const model = require('./model');

const param = function(req,res,next){
    req.args = {model: model,
            getSelect: {},
            listSelect: {},
            logType: "University"
    }
    next();
}

module.exports = function (app) {
    const routes = express.Router();

    let getSelect = {};
    let listSelect = {};

    routes.post('/create',  param,  query.create);
    routes.post('/edit',    param,  query.edit);
    routes.get('/:id',      param,  query.get);
    routes.get('/',         param,  query.list);
    routes.post('/remove',  param,  query.remove);

    routes.post('/department/create', controller.addDepartment);
    routes.post('/department/edit',   controller.editDepartment);
    routes.get('/department/:id',     controller.getDepartment);

    app.use('/university', routes);
}