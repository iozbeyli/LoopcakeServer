const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
const PropertiesModel = require('./../../product/utility/Tools/Properties.js');
const Properties = PropertiesModel.Properties;
const utility = require('./../../product/utility/utility.js');
const isEmpty = utility.isEmpty;
const winston = require('winston')
const config = require('./../../product/config');
const request = require('superagent')

const ContactSchema = new Schema({
  name:         {type: String, required: true},
  email:        {type: String, required: true},
  message:      {type: String},
  institution:  {type: String},
  country:      {type: String},
  date:         {type: Date, default: Date.now},
  properties:   {type: Properties}
});
ContactSchema.index({date: 1});

ContactSchema.methods.canAccess = function(user, readOnly) {
  if(readOnly){
    return user ? user.isAdmin : false
  }else{
    return true
  }
};

ContactSchema.statics.parseJSON = function(body, user) {
  properties= {};

    let object = {
      name:         body.name         || "",
      email:        body.email        || "",
      message:      body.message      || "",
      institution:  body.institution  || "",
      country:      body.country      || "",
      properties:   properties
    };
    object = new this(object);
    if(repOK(object)) {
      sendSlack(object);
      return object;
    } else {
      return null;
    }
};

const repOK = function(object) {
  return !(isEmpty(object.email) || isEmpty(object.name) || !PropertiesModel.repOK(object.properties))
};

const sendSlack = function(body){
    let message = "From:\n*"+body.name+ "* `<" +body.email+ ">`\n" 
                  +body.institution+ " - " +body.country+ "\n"+
                  ">"+body.message+ "\n\n\n";
    
        request
          .post(config.slackContactWebHook)
          .send({"text": message, username: "lc.bot", icon_emoji: ":lc_logo:", mrkdwn: true})
          .end(function(err,resp){
            if(err)
                winston.log('error', 'Slack WebHook Error', {error: err});
            else
                winston.log('debug', 'Contact message sent to slack');
          });
}

module.exports = mongoose.model('Contact', ContactSchema);