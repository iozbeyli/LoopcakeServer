const User = require('./../../models/User');

exports.getUser = function(req,res,next){
  console.log("Get-User request received from:");
  if(!req.user._id){
    console.log("success: false, details: Autherization failed.");
    return res.status(401).send({"success":false, "detail": "Autherization failed!"});
  }

  var query = {};

  if(!req.body || JSON.stringify(req.body).length <= 2){
    query._id = req.user._id;
  }else{
    query = req.body;
  }

  console.log(query);
  User.find(query, {hash: 0, salt: 0}, function (err, docs) {
    if(err){
      console.log("Internal db error");
      console.log(err);
      return res.status(500).send({"success":false, "details": "Internal DB error, check query!", "error": err});
    }

    if(!docs.length){
      console.log("success: false, details: User does not exists");
      return res.status(200).send({"success":false, "details": "User does not exists"});
    }else{
      console.log("success:true, details: User Found");
      return res.status(200).send({"success":true, "details": docs});
    }
  });
};

exports.changePassword = function(req,res,next){
  console.log("Under construction");

    //console.log("success: true, details: Course is updated.");
    return res.status(200).send({"success":false, "details": "Under Construction"});


};
