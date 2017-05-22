const User = require('./../../models/User');
const jwt = require('express-jwt');
const AuthPIN = require('./../../models/AuthPIN');

exports.registration = function(req,res,next){
  console.log("Registration Request Received");
  const user = new User(req.body);
  user.setPassword(req.body.password);

  user.save(err => {
    if (err) {
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    } else {
      console.log("success: true, details: New user Registered.");
      return res.status(200).send({"success":true, "details": "Registered."});
    }
  })
}

exports.login = function(req,res,next){
  console.log("Login Request Received");
  var query = {email: req.body.email};
  User.findOne(query).exec((err, user) => {
    if(err){
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    }
    if(!user){

      console.log("success: false, details: User not found.");
      return res.status(201).send({"success":false, "details": "User not found."});
      return;
    }

    if (!user.validPassword(req.body.password)) {
      console.log("success: false, details: Wrong password.");
      return res.status(202).send({"success":false, "details": "Wrong password."});
    }

    if(!req.body.mobileLogin){
      console.log("success: true, details: Directed to two way authentication.");
      return res.status(203).send({"success":true, "details": "Directed to two way authentication."});
    }else{
      const token = user.generateJwt();
      console.log("success: true, details: User logged in.");
      return res.status(200).send({"success":true, "token": token});
    }
  }
);
};


exports.isTokenValid = function(req,res,next){
    console.log("Validation Request Received");
    if(!req.user._id){
      console.log("success: false, details: Autherization failed.");
      return res.status(401).send({"success":false, "detail": "Autherization failed!"});
    }else{
      console.log("success: true, details: Auth token is valid.");
      return res.status(200).send({"success":true, "detail": "Auth token is valid."});

    }
  };


exports.auth = jwt({
  secret: process.env.MY_TOKEN || 'MY_TOKEN',
  userProperty: 'user'
});
