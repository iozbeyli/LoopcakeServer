const User = require('./model');
const utility = require('./../../utility/utility.js');
const jwt = require('express-jwt');
const bcrypt = require('bcrypt');
const config = require('./../../config.json');
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;
const rounds = parseInt(config.saltRounds);

exports.register = function (req, res, next) {
    if (isEmpty(req.body.password))
      return respondBadRequest(res);
      
  bcrypt.hash(req.body.password, rounds)
  .then(function (hash) {
    req.body.hash = hash;

    let data = User.parseJSON(req.body);
    if (!data)
      return respondBadRequest(res);

    data.save((err) => {
      return respondQuery(res, err, data._id, 'New User', 'Registered');
    });
  });

};

exports.edit = function (req, res, next) {
  console.log("Edit User Request Recevied");
  let id =  req.body._id;
  if (isEmpty(id) || req.body.hash || req.body.isAdmin)
    return respondBadRequest(res);

  return User.findById(id).exec()
  .then(function (user) {
    if(!user)
      return null;
    
    if(!user.canAccess(req.user, false))
      return console.log("err")

    return user.setBy(req.body).save()
  }).then(function(saved){
      data = {
        token: saved.generateJwt(),
        user:  saved._id,
        admin: saved.isAdmin,
        type:  saved.userType
      };
    return respondQuery(res, null, data, 'User', 'Edited');
  }).catch(function(err){
    return respondQuery(res, err, null, 'User', 'Edited');
  });
};


exports.login = function (req, res, next) {
  console.log('Login Request Received');
  let email = req.body.email;
  let password = req.body.password;
  data = {}

  if (isEmpty(email) || isEmpty(password))
    return utility.respondBadRequest(res);
  
  let success = false;
  User.findOne({'email': email}).select("+hash").exec()
  .then(function(user){
    if(!user)
      return false;
    
    if(!user.properties.active())
      return console.log("not active");
    
    data = user;
    return  bcrypt.compare(password, user.hash)
  }).then(function(valid){
    
      if (!valid) {
          detail = 'Login Failed';
          status = 401;
        } else {
          detail = 'Login Successfull';
          status = 200
          success = true;
          data.hash = undefined;
          data = {
            token: data.generateJwt(),
            user:  data
          };
        }
        return respond(res, status, success, detail, data, null);

  }).catch(function(err){
    return respondQuery(res, err, null, 'User', 'Login');
  });
};


exports.auth = jwt({
  secret: process.env.MY_TOKEN || config.JWTSecret,
  userProperty: 'user'
});


