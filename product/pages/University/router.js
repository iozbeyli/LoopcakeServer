const express = require('express');
const controller = require('./controller');
const query = require('./../../utility/query');
const model = require('./model');

const param = function(req,res,next){
    console.log('User request received');
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

    routes.post('/create',            controller.create);
    routes.post('/edit',              controller.edit);
    //routes.post('/remove',   query.remove(model, 'University'));
    routes.get('/:id',     param,  query.get);
    routes.get('/',        param,  query.list);

    routes.post('/department/create', controller.addDepartment);
    routes.post('/department/edit',   controller.editDepartment);
    routes.get('/department/:id',     controller.getDepartment);

    app.use('/university', routes);
}