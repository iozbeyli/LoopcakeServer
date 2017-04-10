const model = require('./model');
const utility = require('./../utility/utility.js');
const jwt = require('express-jwt');
const bcrypt = require('bcrypt');
const config = require('./../config.json');
const parseQueryOptions = utility.parseQueryOptions;
const isEmpty = utility.isEmpty;
const respond = utility.respond;
const respondQuery = utility.respondQuery;
const respondBadRequest = utility.respondBadRequest;

exports.register = function (req, res, next) {
  console.log('User Application Received');
  console.log(req.body);
  let object = {
    username: req.body.username,
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    photo: req.body.photo
  };
  let password = req.body.password;
  if (isEmpty(object.username) || isEmpty(object.email) || isEmpty(password))
    return respondBadRequest(res);

  let rounds = parseInt(config.saltRounds);
  bcrypt.hash(password, rounds).then(function (hash) {
    object.hash = hash;
    console.log(object);
    const data = new model(object);
    data.save((err) => {
      return respondQuery(res, err, data._id, 'New User', 'Registered');
    });
  });

};

exports.edit = function (req, res, next) {
  console.log("Edit User Request Recevied");
  let query = {
    _id: req.body._id
  };
  let upt = {
    set: {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      photo: req.body.photo,
      message: req.body.message
    }
  };

  if (isEmpty(query._id) || isEmpty(upt.email))
    return respondBadRequest(res);

  model.findByIdAndUpdate(query, upt, {
      new: true
    },
    function (err, data) {
      return respondQuery(res, err, data._id, 'User', 'Edited');
    });
};


exports.login = function (req, res, next) {
  console.log('Login Request Received');
  let username = req.body.username;
  let password = req.body.password;

  if (isEmpty(username) || isEmpty(password))
    return utility.respondBadRequest(res);

    console.log(username);
    console.log(password);
  model.findOne({
    'username': username
  }).exec((err, user) => {
    console.log("Comparing "+user.hash+" "+password);
    let detail = '';
    let success = false;
    let status = 200;
    let data = null;
    if (err) {
      detail = 'Internal DB error';
      status = 500;
    } else if (!user) {
      detail = 'Login Failed';
      status = 401;
    } else {
      if (status != 200)
        return respond(res, status, success, detail, data, err);

      bcrypt.compare(password, user.hash, function (err, valid) {
        if (!valid) {
          detail = 'Login Failed';
          status = 401;
        } else {
          detail = 'Login Successfull';
          status = 200
          success = true;
          data = {
            token: user.generateJwt(),
            _id: user._id,
            admin: user.admin
          };
        }
        return respond(res, status, success, detail, data, err);

      });
    }
  });
};


exports.auth = jwt({
  secret: process.env.MY_TOKEN || config.JWTSecret,
  userProperty: 'user'
});


