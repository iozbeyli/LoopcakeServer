const express = require('express');
const query = require('./../../product/utility/query');
const model = require('./model');

const param = function(req,res,next){
    console.log('contact request received');
    req.args = {model: model,
            getSelect: {},
            listSelect:{email: 1, type: 1, date: 1, country:1},
            logType: "Contact"
    }
    next();
}

module.exports = function (app) {
    const routes = express.Router();

    routes.post('/create',  param,  query.create);
    routes.post('/edit',    param,  query.edit);
    routes.get('/:id',      param,  query.get);
    routes.get('/',         param,  query.list);

    app.use('/landing/contact', routes);
}