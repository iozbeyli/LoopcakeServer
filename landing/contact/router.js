const express = require('express');
const query = require('./../../product/utility/query');
const model = require('./model');
const request = require('superagent');
const winston = require('winston');
const config = require('./../../product/config');

const param = function(req,res,next){
    req.args = {model: model,
            getSelect: {},
            listSelect:{email: 1, type: 1, date: 1, country:1},
            logType: "Contact"
    }
    next();
}

const sendSlack = function(req,res,next){
    let message = "From:\n*"+req.body.name+ "* `<" +req.body.email+ ">`\n" 
                  +req.body.institution+ " - " +req.body.country+ "\n"+
                  ">"+req.body.message+ "\n\n\n";
    
        request
          .post(config.slackContactWebHook)
          .send({"text": message, username: "lc.bot", icon_emoji: ":lc_logo:", mrkdwn: true})
          .end(function(err,resp){
            if(err)
                winston.log('error', 'Slack WebHook Error', {error: err});
            else
                winston.log('debug', 'Contact message sent to slack');
          });
    next();
}

module.exports = function (app) {
    const routes = express.Router();

    routes.post('/create',  param, sendSlack,  query.create);
    routes.post('/edit',    param,  query.edit);
    routes.get('/:id',      param,  query.get);
    routes.get('/',         param,  query.list);

    app.use('/landing/contact', routes);
}