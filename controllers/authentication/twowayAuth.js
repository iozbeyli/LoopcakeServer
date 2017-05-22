const User = require('./../../models/User');
const jwt = require('express-jwt');
const AuthPIN = require('./../../models/AuthPIN');

exports.twoWay = function(req,res,next){
  console.log("two way Request Received");
  console.log(req.body);

  AuthPIN.findOne({email: req.body.email}).exec((err, pin) => {
    if(err){
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    }
    if(!pin){

      console.log("success: false, details: pin not found.");
      return res.status(201).send({"success":false, "details": "PIN not found."});
      return;
    }

    if(pin.isExpired()){
        console.log("success: false, details: PIN expired.");
        return res.status(202).send({"success":false, "details": "PIN expired."});
    }

    if (!pin.isValidPIN(req.body.pin)) {
      console.log("success: false, details: Wrong pin.");
      return res.status(203).send({"success":false, "details": "Wrong pin."});
    }

    User.findOne({email: req.body.email}).exec((err, user) => {
    if(err){
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    }
      const token = user.generateJwt();
      console.log("success: true, details: User logged in.");
      return res.status(200).send({"success":true, "token": token});
    
    });


  });
};

exports.generatePIN = function(req, res, next){
    var query = {email:  req.user.email};
    var upt   = {email:  req.user.email,
                 pin:    Math.floor(10000 + Math.random() * 90000),
                 date:   Date.now()};

    AuthPIN.findOneAndUpdate(query, upt, {upsert: true, new: true}).exec((err, doc) => {
        if(err){
            console.log("Internal db error");
            console.log(err);
            return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
        }
            console.log("success: true, details: Two way authentication PIN generated.");
            return res.status(200).send({"success":true, "pin": doc.pin});
      });
}

