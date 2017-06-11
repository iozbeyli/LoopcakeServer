const express = require('express');
const controller = require('./controller');
const query = require('./../../utility/query');
const model = require('./model');

const param = function(req,res,next){
    console.log('List request received');
    req.args = {model: model,
            getSelect: {},
            listSelect: {_id: 1, name: 1, university: 1, code: 1, year: 1, term: 1},
            logType: "Course"
    }
    next();
}


module.exports = function (app) {
    const routes = express.Router();

    routes.post('/create',   controller.create);
    routes.post('/edit',     controller.edit);
    //routes.post('/remove',   query.remove(model, 'Course'));
    routes.get('/:id',   param,    query.get);
    routes.get('/',      param,    query.list);

    routes.post('/enroll',  controller.addStudentsFromEMail)

    app.use('/course', routes);
}