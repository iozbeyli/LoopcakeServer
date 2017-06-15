const express = require('express');
const controller = require('./controller');
const query = require('./../../utility/query');
const model = require('./model');

const param = function(req,res,next){
    console.log('List request received');
    req.args = {model: model,
            getSelect: {},
            listSelect: {_id: 1, name: 1, department: 1, code: 1, "details.year": 1, "details.term": 1},
            logType: "Course"
    }
    next();
}

const student = function(req, res, next){
    req.operation = 0;
    next();
}
const instructor = function(req, res, next){
    req.operation = 1;
    next();
}


module.exports = function (app) {
    const routes = express.Router();

    routes.post('/create',  param,  query.create);
    routes.post('/edit',    param,  query.edit);
    routes.get('/:id',      param,  query.get);
    routes.get('/',         param,  query.list);
    routes.post('/remove',  param,  query.remove);

    routes.post('/student/add',         student,      controller.addUserByEmail)
    routes.post('/instructor/add',      instructor,   controller.addUserByEmail)
    routes.post('/student/remove',      student,      controller.removeUserById)
    routes.post('/instructor/remove',   instructor,   controller.removeUserById)

    routes.post('/attended',            controller.listAttendedCourses)
    routes.post('/given',               controller.listGivenCourses)

    routes.post('/detail/section/add',      controller.addDetailSection)
    routes.post('/detail/section/edit',     controller.editDetailSection)
    routes.post('/detail/section/remove',   controller.removeDetailSection)

    app.use('/course', routes);
}