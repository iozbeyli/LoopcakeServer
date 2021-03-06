const express = require('express');
const controller = require('./controller');
const query = require('./../../utility/query');
const model = require('./model');

const param = function(req,res,next){
    req.args = {model: model,
            getSelect: {},
            listSelect:{name: 1, course: 1, deadline: 1},
            logType: "Project"
    }
    next();
}

module.exports = function (app) {
    const routes = express.Router();

    routes.post('/create',  param,  query.create);
    routes.post('/edit',    param,  query.edit);
    routes.get('/:id',      param,  query.get);
    routes.get('/',         param,  query.list);
    routes.post('/remove',  param,  query.remove);

    routes.post('/checkpoint/add',      controller.addCheckpoint);
    routes.post('/checkpoint/remove',   controller.removeCheckpoint);
    routes.get('/checklist/:id',       controller.getChecklist);

    app.use('/project', routes);
}